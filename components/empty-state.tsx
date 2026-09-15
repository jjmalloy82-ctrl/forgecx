import Link from "next/link";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="panel px-6 py-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">Empty</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-400">{body}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
