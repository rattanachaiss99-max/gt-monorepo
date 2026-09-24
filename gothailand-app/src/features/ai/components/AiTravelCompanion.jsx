import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendAiQuery, checkAiStatus } from "../../../services/aiService";

const GUEST_STORAGE_KEY = "gt_guest_trial_credits";
const DEFAULT_GUEST_CREDITS = 3;

// ============================================================================
// SVG ICONS
// ============================================================================
function SparkleIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SendIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MessageBubbleIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const QUICK_PROMPTS = [
  {
    label: "🌿 จิบชาดอยเชียงราย",
    text: "ช่วยวางแผนเที่ยวเชียงราย 2 วัน 1 คืน เน้นจิบชาบนดอย ไร่ชา และจุดชมทะเลหมอก",
  },
  {
    label: "🌊 พูลวิลล่าภูเก็ต",
    text: "แนะนำพูลวิลล่าหรือที่พักวิวทะเลสวยๆ ในภูเก็ต เหมาะสำหรับครอบครัว",
  },
  {
    label: "🚗 รถเช่า 7 ที่นั่งลุยดอย",
    text: "ต้องการรถเช่า 7 ที่นั่งขับเคลื่อน 4 ล้อ สำหรับลุยขึ้นเขาภาคเหนือ",
  },
  {
    label: "🧑‍🌾 ไกด์ภาคเหนือใบอนุญาตแท้",
    text: "ค้นหาไกด์นำเที่ยวที่มีใบอนุญาตถูกต้อง พาเดินป่าดอยอินทนนท์ สื่อสารภาษาอังกฤษได้",
  },
];

export default function AiTravelCompanion() {
  const navigate = useNavigate();

  // Auth & Credit State
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    canAccessAi: false,
    aiCredits: 0,
    userName: "",
  });
  const [guestCredits, setGuestCredits] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? DEFAULT_GUEST_CREDITS : parsed;
      }
      localStorage.setItem(GUEST_STORAGE_KEY, DEFAULT_GUEST_CREDITS.toString());
    }
    return DEFAULT_GUEST_CREDITS;
  });

  // Chat State
  const [query, setQuery] = useState("");
  const selectedModel = "Gemini 3.6 Flash";
  const [loading, setLoading] = useState(false);
  const [convoHistory, setConvoHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // 1. ตรวจสอบสถานะ User จาก backend
  useEffect(() => {
    checkAiStatus()
      .then((data) => {
        if (data.isAuthenticated && data.user) {
          setAuthStatus({
            isAuthenticated: true,
            canAccessAi: Boolean(data.user.canAccessAi),
            aiCredits:
              typeof data.user.aiCredits === "number" ? data.user.aiCredits : 0,
            userName: data.user.name || "",
          });
        }
      })
      .catch((err) => console.warn("Status check failed:", err));
  }, []);

  const isGuestMode = !authStatus.isAuthenticated || authStatus.aiCredits <= 0;
  const isOutOfCredits =
    isGuestMode &&
    guestCredits <= 0 &&
    (!authStatus.isAuthenticated || authStatus.aiCredits <= 0);

  // 2. ส่งคำถามหา AI
  const handleSend = async (customQuery) => {
    const textToSend = (
      typeof customQuery === "string" ? customQuery : query
    ).trim();
    if (!textToSend || loading) return;

    if (isOutOfCredits) {
      setErrorMsg(
        "คุณใช้สิทธิ์ทดลองถาม AI ฟรีครบ 3 ครั้งแล้ว กรุณาสมัครสมาชิกหรือเข้าสู่ระบบเพื่อรับเครดิตเพิ่ม!",
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendAiQuery({
        query: textToSend,
        activeRegion: "all",
      });

      if (!res.success) {
        throw new Error(res.error || "เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล");
      }

      // หักโควตา Guest ในกรณีไม่มี Token
      if (!authStatus.isAuthenticated) {
        const nextQuota = Math.max(0, guestCredits - 1);
        setGuestCredits(nextQuota);
        if (typeof window !== "undefined") {
          localStorage.setItem(GUEST_STORAGE_KEY, nextQuota.toString());
        }
      } else if (typeof res.creditsRemaining === "number") {
        setAuthStatus((prev) => ({ ...prev, aiCredits: res.creditsRemaining }));
      }

      const newConvo = {
        id: Date.now().toString(),
        query: textToSend,
        reply: res.reply,
        matchedProvinces: res.matchedProvinces || [],
        source: res.source,
        createdAt: new Date(),
      };

      setConvoHistory((prev) => [newConvo, ...prev]);
      setQuery("");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    } catch (err) {
      setErrorMsg(
        err.message || "ไม่สามารถติดต่อ AI Service ได้ กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* 1. Badge Header */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold shadow-xs">
          <MessageBubbleIcon className="w-3.5 h-3.5" />
          <span>สนทนา AI • วางแผนเที่ยวไทย</span>
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 text-center tracking-tight mb-2">
        เพื่อนวางแผนเที่ยว{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-indigo-600">
          AI Travel Copilot
        </span>
      </h2>
      <p className="text-slate-600 text-center max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
        ที่ปรึกษาการเดินทางส่วนตัวที่จะเปลี่ยนทุกทริปให้เป็นเรื่องง่าย
        ค้นหาไฮไลต์ 77 จังหวัด แนะนำที่พัก รถเช่า และไกด์อย่างตรงใจ
      </p>

      {/* 2. Quota & Credit Status Badge */}
      <div className="flex justify-center mb-6">
        {isGuestMode ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              โหมดทดลองใช้ฟรี • สิทธิ์ถาม AI คงเหลือ:{" "}
              <strong className="font-bold text-amber-900">
                {guestCredits}/3
              </strong>{" "}
              ครั้ง
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <SparkleIcon className="w-4 h-4 text-emerald-600" />
            <span>
              ยินดีต้อนรับ {authStatus.userName || "สมาชิก"} • เครดิต AI
              คงเหลือ:{" "}
              <strong className="font-bold text-emerald-900">
                {authStatus.aiCredits}
              </strong>{" "}
              เครดิต
            </span>
          </div>
        )}
      </div>

      {/* 3. Signature Chat Input Box */}
      <div className="bg-white rounded-3xl border-2 border-sky-400 p-4 sm:p-5 shadow-lg shadow-sky-100/50 transition-all focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-100 mb-4">
        <textarea
          ref={inputRef}
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || isOutOfCredits}
          placeholder={
            isOutOfCredits
              ? "สิทธิ์ทดลองถามฟรีครบ 3 ครั้งแล้ว (เข้าสู่ระบบเพื่อรับเครดิตใช้งานต่อ)"
              : 'ถามได้เลย เช่น "อยากไปจิบชาบนดอยเชียงราย 2 วัน 1 คืน" หรือ "แนะนำพูลวิลล่าริมทะเล"'
          }
          className="w-full text-slate-800 text-sm sm:text-base placeholder:text-slate-400 resize-none border-none outline-none bg-transparent"
        />

        {/* Bottom Bar: Model Selector + Send Button */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <SparkleIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>{selectedModel}</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (RAG 77 จังหวัด + Gemini AI)
            </span>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || loading || isOutOfCredits}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              query.trim() && !loading && !isOutOfCredits
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/30 hover:bg-sky-700 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
            title="ส่งคำถาม"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
        <span className="text-xs text-slate-400 font-medium mr-1">ลองถาม:</span>
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(item.text);
              inputRef.current?.focus();
            }}
            disabled={loading || isOutOfCredits}
            className="px-3 py-1 text-xs font-medium rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 4. Results & Error Handling */}
      <div ref={resultsRef} />

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-700 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State Indicator */}
      {loading && (
        <div className="mb-6 p-5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center gap-3 animate-pulse">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <div className="font-bold text-sm text-sky-900">
              Go Thailand AI กำลังวิเคราะห์ข้อมูลและวางแผนให้คุณ...
            </div>
            <div className="text-xs text-sky-600">
              ค้นหาสถานที่ท่องเที่ยว วัฒนธรรมท้องถิ่น
              และข้อเสนอพิเศษจากฐานข้อมูล 77 จังหวัด
            </div>
          </div>
        </div>
      )}

      {/* Conversation Cards */}
      {convoHistory.length > 0 && (
        <div className="space-y-6">
          {convoHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* User Query */}
              <div className="flex items-start gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  คุณ
                </div>
                <div className="font-bold text-slate-800 text-base pt-0.5">
                  {item.query}
                </div>
              </div>

              {/* AI Reply */}
              <div className="pl-3 sm:pl-4 border-l-3 border-sky-500 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparkleIcon className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-xs uppercase tracking-wider text-sky-700">
                    Go Thailand AI Copilot
                  </span>
                  {item.source && (
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md">
                      {item.source}
                    </span>
                  )}
                </div>
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {item.reply}
                </div>
              </div>

              {/* Matched Provinces Chips */}
              {item.matchedProvinces && item.matchedProvinces.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span>จุดหมายและจังหวัดที่ตรงกับความต้องการ:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.matchedProvinces.map((prov) => (
                      <button
                        key={prov.slug}
                        onClick={() =>
                          navigate(`/accommodations?province=${prov.slug}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>✨ {prov.nameTh}</span>
                        <span className="text-slate-400 font-normal">
                          ({prov.region})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
