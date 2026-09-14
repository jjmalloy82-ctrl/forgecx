import { ConfirmSubmit } from "@/components/confirm-submit";
import { ClosePunchForm, PunchEditForm, ReopenPunchForm, StartPunchForm } from "@/components/punch-edit";
import { PunchStatusChip, SeverityChip } from "@/components/chips";
import { deletePunch } from "@/lib/actions";
import { getPunch } from "@/lib/queries";
import { formatDate, isOverdue, punchCode } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Punch" };

export default async function PunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const punch = getPunch(id);
  if (!punch) notFound();
  const overdue = isOverdue(punch.dueDate, punch.status);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/app/punches" className="text-xs font-medium text-volt hover:underline">
          ← Punch list
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-volt">{punchCode(punch.number)}</p>
            <h1 className="mt-1 max-w-3xl text-3xl font-semibold text-white">{punch.title}</h1>
            <p className="mt-2 text-sm text-ink-300">
              <Link href={`/app/projects/${punch.projectId}`} className="hover:text-volt">
                {punch.projectName}
              </Link>
              {" · "}
              <Link href={`/app/projects/${punch.projectId}/systems/${punch.systemId}`} className="font-mono hover:text-volt">
                {punch.systemTag}
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SeverityChip value={punch.severity} />
              <PunchStatusChip value={punch.status} />
              <span className="text-sm text-ink-300">Owner {punch.owner}</span>
              <span className={`text-sm ${overdue ? "font-semibold text-red-300" : "text-ink-300"}`}>
                Due {formatDate(punch.dueDate)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {punch.status === "open" ? <StartPunchForm punchId={punch.id} /> : null}
            {punch.status === "closed" ? <ReopenPunchForm punchId={punch.id} /> : null}
            <ConfirmSubmit
              action={deletePunch}
              label="Delete"
              confirm="Delete this punch?"
            >
              <input type="hidden" name="id" value={punch.id} />
              <input type="hidden" name="returnTo" value="/app/punches" />
            </ConfirmSubmit>
          </div>
        </div>
      </div>

      {punch.description ? (
        <article className="panel p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">Observed</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">{punch.description}</p>
        </article>
      ) : null}

      {punch.status !== "closed" ? <ClosePunchForm punchId={punch.id} /> : (
        <article className="panel p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-300">Evidence on file</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
            {punch.evidenceNotes || "Closed with no notes (legacy)."}
          </p>
          <p className="mt-3 font-mono text-xs text-ink-500">Closed {formatDate(punch.closedAt)}</p>
        </article>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Edit punch</h2>
        <PunchEditForm punch={punch} />
      </section>
    </div>
  );
}
