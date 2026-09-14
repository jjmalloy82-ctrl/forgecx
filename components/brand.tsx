import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      Forge<span className="text-volt">CX</span>
    </span>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" rx="6" fill="#0a0f18" stroke="#22d3ee" strokeWidth="1.5" />
      <path d="M8 22V10h10.5c2.6 0 4.5 1.7 4.5 4.1 0 1.7-1 3-2.5 3.6L23 22h-3.2l-2.3-4.1H11.2V22H8Zm3.2-6.6h6.6c1.2 0 2-.7 2-1.8s-.8-1.8-2-1.8h-6.6v3.6Z" fill="#22d3ee" />
    </svg>
  );
}

export function BrandLink({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-white">
      <LogoMark size={compact ? 26 : 32} />
      <span className="leading-tight">
        <Wordmark className={compact ? "text-base" : "text-lg"} />
        {!compact ? (
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            Close the plant. Keep the proof.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
