import React, { useState } from 'react';
import { X, Send, User, CheckCheck, Clock } from 'lucide-react';
import { Guide, BookingState } from '../types';

interface ContactGuideModalProps {
  guide: Guide;
  bookingState: BookingState;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'guide' | 'user';
  text: string;
  time: string;
}

export const ContactGuideModal: React.FC<ContactGuideModalProps> = ({
  guide,
  bookingState,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'guide',
      text: `Sawasdee krub! I'm ${guide.name}. Thank you so much for booking your tour with me! I'm looking forward to meeting you at ${bookingState.meetingPoint || 'the hotel lobby'}. Please let me know if you have any special food preferences or places you'd love to see.`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Auto guide reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'guide',
          text: `Got it! I will prepare our itinerary accordingly. See you on ${bookingState.date || 'tour day'} at 9:00 AM!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0b1a30] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={guide.avatar}
              alt={guide.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-amber-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm">{guide.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
              </div>
              <p className="text-[11px] text-stone-300">Local Guide • {guide.location}</p>
            </div>
          </div>
          <button
            id="close-contact-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf9f6]">
          <div className="text-center text-[10px] text-stone-600 my-1">
            End-to-end encrypted direct connection with your guide
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#0b1a30] text-white rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-stone-600 mt-1 px-1">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            id="contact-guide-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${guide.name}...`}
            className="flex-1 px-3.5 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400"
          />
          <button
            id="send-guide-message-btn"
            type="submit"
            className="px-4 py-2 bg-[#d4a326] hover:bg-[#b88c1c] text-[#1c1d1f] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
