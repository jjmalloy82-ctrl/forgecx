"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="panel mx-auto max-w-lg p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-300">Board error</p>
      <h1 className="mt-2 text-xl font-semibold text-white">Could not complete that action</h1>
      <p className="mt-2 text-sm text-ink-300">{error.message}</p>
      <button type="button" className="btn-primary mt-6" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
