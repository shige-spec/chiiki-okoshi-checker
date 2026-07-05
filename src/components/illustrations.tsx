export function StepIcon({ step, active }: { step: number; active?: boolean }) {
  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
        active
          ? "bg-brand text-white shadow-md shadow-brand/30"
          : "bg-brand-light text-brand-dark"
      }`}
    >
      {step}
    </div>
  );
}

export function MapPinIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#EEF8F2" />
      <path
        d="M24 8C17.4 8 12 13.2 12 19.8c0 9.6 12 20.2 12 20.2s12-10.6 12-20.2C36 13.2 30.6 8 24 8z"
        fill="#33A474"
      />
      <circle cx="24" cy="19" r="5" fill="white" />
    </svg>
  );
}
