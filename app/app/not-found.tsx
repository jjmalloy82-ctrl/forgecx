import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-volt">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Not on this job</h1>
      <p className="mt-2 text-sm text-ink-400">That project, system, or punch is not in the board.</p>
      <Link href="/app" className="btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}
