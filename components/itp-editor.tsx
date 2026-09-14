import { createItpItem, deleteItpItem, updateItpItem } from "@/lib/actions";
import { ITP_RESULT_LABEL } from "@/lib/utils";
import type { ItpItem } from "@/lib/types";
import { ConfirmSubmit } from "./confirm-submit";
import { ItpChip } from "./chips";

export function ItpEditor({
  items,
  projectId,
  systemId,
}: {
  items: ItpItem[];
  projectId: string;
  systemId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="panel px-5 py-8 text-sm text-ink-400">No ITP rows on this system yet.</div>
        ) : (
          items.map((item) => (
            <form key={item.id} action={updateItpItem} className="panel grid gap-3 p-4 md:grid-cols-12 md:items-end">
              <input type="hidden" name="id" value={item.id} />
              <label className="md:col-span-1">
                <span className="label">Step</span>
                <input name="stepNumber" type="number" min={1} defaultValue={item.stepNumber} className="field font-mono" />
              </label>
              <label className="md:col-span-4">
                <span className="label">Check</span>
                <input name="title" required defaultValue={item.title} className="field" />
              </label>
              <label className="md:col-span-2">
                <span className="label">Procedure</span>
                <input name="procedureRef" defaultValue={item.procedureRef} className="field font-mono" />
              </label>
              <label className="md:col-span-2">
                <span className="label">Result</span>
                <select name="result" defaultValue={item.result} className="field">
                  {Object.entries(ITP_RESULT_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="md:col-span-3">
                <span className="label">Notes</span>
                <input name="notes" defaultValue={item.notes} className="field" />
              </label>
              <div className="flex gap-2 md:col-span-12">
                <button type="submit" className="btn-primary text-xs">
                  Save row
                </button>
                <ItpChip value={item.result} />
                <ConfirmSubmit
                  action={deleteItpItem}
                  label="Delete"
                  confirm="Delete this ITP row?"
                  className="btn-danger text-xs"
                >
                  <input type="hidden" name="id" value={item.id} />
                </ConfirmSubmit>
              </div>
            </form>
          ))
        )}
      </div>

      <form action={createItpItem} className="panel grid gap-3 p-4 md:grid-cols-3">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="systemId" value={systemId} />
        <label className="md:col-span-2">
          <span className="label">New ITP check</span>
          <input name="title" required className="field" placeholder="e.g. Integrated systems test readiness gate" />
        </label>
        <label>
          <span className="label">Procedure ref</span>
          <input name="procedureRef" className="field font-mono" placeholder="ITP-SYS-01" />
        </label>
        <div>
          <button type="submit" className="btn-ghost">
            Add ITP row
          </button>
        </div>
      </form>
    </div>
  );
}
