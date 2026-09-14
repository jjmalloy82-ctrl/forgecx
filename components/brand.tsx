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
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-md border border-volt bg-ink-950 font-mono font-bold text-volt"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      CX
    </span>
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
