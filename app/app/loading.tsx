export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-ink-800" />
      <div className="grid gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-ink-800" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-ink-800" />
    </div>
  );
}
