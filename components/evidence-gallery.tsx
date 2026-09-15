import { attachEvidence, deleteEvidence } from "@/lib/actions";
import type { EvidenceFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ConfirmActionButton } from "./confirm-submit";

export function EvidenceGallery({
  punchId,
  files,
}: {
  punchId: string;
  files: EvidenceFile[];
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Photo evidence</h2>
        <p className="mt-1 text-sm text-ink-400">
          Field photos live with the punch. Notes stay required to close; pictures are the proof the owner can open.
        </p>
      </div>

      {files.length === 0 ? (
        <div className="panel px-5 py-8 text-sm text-ink-400">No photos on this punch yet.</div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((f) => (
            <li key={f.id} className="panel overflow-hidden">
              <a href={`/app/evidence/${f.id}`} target="_blank" rel="noreferrer" className="block bg-ink-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/app/evidence/${f.id}`}
                  alt={f.originalName}
                  className="h-40 w-full object-cover"
                />
              </a>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{f.originalName}</p>
                  <p className="font-mono text-[11px] text-ink-500">{formatDate(f.createdAt)}</p>
                </div>
                <ConfirmActionButton
                  action={deleteEvidence}
                  fields={{ id: f.id }}
                  label="Remove"
                  confirm="Remove this photo from the punch?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={attachEvidence} className="panel grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-end">
        <input type="hidden" name="punchId" value={punchId} />
        <label>
          <span className="label">Attach image</span>
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" required className="field file:mr-3 file:rounded file:border-0 file:bg-ink-700 file:px-3 file:py-1 file:text-xs file:text-white" />
        </label>
        <button type="submit" className="btn-primary">
          Upload photo
        </button>
      </form>
    </section>
  );
}
