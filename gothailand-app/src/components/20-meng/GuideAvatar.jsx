/* ============================================================
   components/GuideAvatar.jsx
   Draws a cartoon portrait of a tourist guide as an inline SVG.

   Instead of using real photos, every guide gets a generated
   avatar. The looks are controlled by the "avatar" object in
   moc-data/guides.js:
     - skin      : skin color
     - hair      : hair color
     - hairStyle : "short" | "long" | "bun"
     - shirt     : shirt color
     - bg1, bg2  : the two colors of the background gradient
   ============================================================ */

import { useId } from "react";

export default function GuideAvatar({ avatar, name }) {
  // useId gives this component a unique id, used for the SVG
  // gradient so that multiple avatars on one page do not mix
  // their gradient definitions with each other.
  // (":" characters are removed because they are not allowed
  // inside a url(#...) reference.)
  const rawId = useId();
  const gradientId = "grad-" + rawId.replace(/:/g, "");

  // Male guides (short hair) also get a traditional Thai sash
  const showSash = avatar.hairStyle === "short";

  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" role="img" aria-label={`Portrait of guide ${name}`}>
      <defs>
        {/* background gradient behind the guide */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={avatar.bg1} />
          <stop offset="100%" stopColor={avatar.bg2} />
        </linearGradient>
      </defs>

      {/* background */}
      <rect width="200" height="240" fill={`url(#${gradientId})`} />

      {/* ----- body ----- */}
      {/* shoulders / shirt */}
      <path d="M28 240 C28 192 62 172 100 172 C138 172 172 192 172 240 Z" fill={avatar.shirt} />
      {/* traditional Thai sash across the chest (male guides) */}
      {showSash && (
        <path d="M60 200 L140 180 L144 196 L64 216 Z" fill="#f2b429" opacity="0.95" />
      )}
      {/* neck */}
      <rect x="86" y="134" width="28" height="34" rx="10" fill={avatar.skin} />

      {/* ----- head ----- */}
      {/* ears */}
      <ellipse cx="61" cy="108" rx="7" ry="11" fill={avatar.skin} />
      <ellipse cx="139" cy="108" rx="7" ry="11" fill={avatar.skin} />
      {/* face */}
      <ellipse cx="100" cy="104" rx="40" ry="46" fill={avatar.skin} />

      {/* ----- hair (3 possible styles) ----- */}
      {avatar.hairStyle === "short" && (
        <path
          d="M60 100 C58 62 76 50 100 50 C124 50 142 62 140 100 C138 78 124 66 100 66 C76 66 62 78 60 100 Z"
          fill={avatar.hair}
        />
      )}
      {avatar.hairStyle === "long" && (
        <g fill={avatar.hair}>
          {/* top of the head */}
          <path d="M60 100 C58 62 76 50 100 50 C124 50 142 62 140 100 C138 78 124 66 100 66 C76 66 62 78 60 100 Z" />
          {/* hair falling down on both sides */}
          <path d="M60 96 C54 148 58 178 70 192 L84 186 C74 152 74 118 78 96 Z" />
          <path d="M140 96 C146 148 142 178 130 192 L116 186 C126 152 126 118 122 96 Z" />
        </g>
      )}
      {avatar.hairStyle === "bun" && (
        <g fill={avatar.hair}>
          <path d="M60 100 C58 62 76 50 100 50 C124 50 142 62 140 100 C138 78 124 66 100 66 C76 66 62 78 60 100 Z" />
          <circle cx="100" cy="44" r="14" />
        </g>
      )}

      {/* ----- face details ----- */}
      {/* eyebrows */}
      <path d="M76 92 Q85 86 94 91" stroke={avatar.hair} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M106 91 Q115 86 124 92" stroke={avatar.hair} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="86" cy="103" r="4" fill="#20304e" />
      <circle cx="114" cy="103" r="4" fill="#20304e" />
      {/* nose */}
      <path d="M100 108 L97 119 Q100 122 104 119" stroke="#c98d63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* friendly smile */}
      <path d="M88 129 Q100 140 112 129" stroke="#8a4b38" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
