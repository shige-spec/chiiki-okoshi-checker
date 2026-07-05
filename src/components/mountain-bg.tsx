export function MountainBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* ⑤: 左下 — 山＋松（グリーン） */}
      <svg
        className="absolute -bottom-4 -left-4 h-[42vh] w-[min(32vw,280px)] lg:h-[48vh]"
        viewBox="0 0 280 400"
        fill="none"
      >
        <path d="M0 400 L0 220 L50 160 L95 200 L140 110 L185 170 L230 90 L280 130 L280 400 Z" fill="#c5e6d4" />
        <path d="M0 400 L0 280 L70 230 L115 270 L160 210 L205 260 L255 200 L280 240 L280 400 Z" fill="#33a474" opacity="0.32" />
        <path d="M0 400 L0 330 L55 300 L100 320 L145 290 L190 310 L240 280 L280 300 L280 400 Z" fill="#1e6b4a" opacity="0.18" />
        <path d="M38 280 L48 240 L58 280 Z" fill="#2d8a5e" />
        <rect x="46" y="280" width="4" height="18" fill="#5a4a3a" />
        <path d="M72 300 L82 258 L92 300 Z" fill="#33a474" />
        <rect x="80" y="300" width="4" height="16" fill="#5a4a3a" />
        <path d="M118 270 L128 228 L138 270 Z" fill="#2d8a5e" />
        <rect x="126" y="270" width="4" height="20" fill="#5a4a3a" />
      </svg>

      {/* ⑤: 右下 — 山＋松（グリーン） */}
      <svg
        className="absolute -bottom-2 -right-2 h-[46vh] w-[min(34vw,300px)] lg:h-[52vh]"
        viewBox="0 0 300 420"
        fill="none"
      >
        <path d="M300 420 L300 230 L250 170 L205 210 L160 120 L115 180 L70 100 L25 140 L0 180 L0 420 Z" fill="#c5e6d4" />
        <path d="M300 420 L300 290 L240 240 L195 280 L150 220 L105 260 L60 210 L15 250 L0 270 L0 420 Z" fill="#33a474" opacity="0.32" />
        <path d="M300 420 L300 340 L245 310 L200 330 L155 300 L110 320 L60 295 L0 315 L0 420 Z" fill="#1e6b4a" opacity="0.18" />
        <path d="M228 290 L238 248 L248 290 Z" fill="#2d8a5e" />
        <rect x="236" y="290" width="4" height="18" fill="#5a4a3a" />
        <path d="M192 310 L202 268 L212 310 Z" fill="#33a474" />
        <rect x="200" y="310" width="4" height="16" fill="#5a4a3a" />
        <path d="M148 275 L158 233 L168 275 Z" fill="#2d8a5e" />
        <rect x="156" y="275" width="4" height="20" fill="#5a4a3a" />
      </svg>
    </div>
  );
}
