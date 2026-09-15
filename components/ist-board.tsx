import { createIstGate, deleteIstGate, updateIstGate } from "@/lib/actions";
import { IST_RESULT_LABEL } from "@/lib/utils";
import type { IstGate } from "@/lib/types";
import { ConfirmActionButton } from "./confirm-submit";
import { Chip } from "./chips";
import { EmptyState } from "./empty-state";

export function IstBoard({ gates, projectId }: { gates: IstGate[]; projectId: string }) {
  const fail = gates.filter((g) => g.result === "fail").length;
  const pass = gates.filter((g) => g.result === "pass").length;
  const pending = gates.filter((g) => g.result === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 font-mono text-sm">
        <span className="text-red-300">{fail} fail</span>
        <span className="text-ink-400">{pending} pending</span>
        <span className="text-emerald-300">{pass} pass</span>
        <span className="text-ink-500">{gates.length} gates</span>
      </div>

      {gates.length === 0 ? (
        <EmptyState
          title="No IST / energization gates yet"
          body="Add the hold points that actually matter before first sync or IST: LOTO, relays, sync checks, trips."
        />
      ) : (
        <div className="space-y-3">
          {gates.map((g) => (
            <form key={g.id} action={updateIstGate} className="panel grid gap-3 p-4 md:grid-cols-12 md:items-end">
              <input type="hidden" name="id" value={g.id} />
              <label className="md:col-span-1">
                <span className="label">#</span>
                <input name="stepNumber" type="number" min={1} defaultValue={g.stepNumber} className="field font-mono" />
              </label>
              <label className="md:col-span-5">
                <span className="label">Gate</span>
                <input name="title" required defaultValue={g.title} className="field" />
              </label>
              <label className="md:col-span-2">
                <span className="label">Result</span>
                <select name="result" defaultValue={g.result} className="field">
                  {Object.entries(IST_RESULT_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="md:col-span-4">
                <span className="label">Notes</span>
                <input name="notes" defaultValue={g.notes} className="field" />
              </label>
              <div className="flex flex-wrap items-center gap-2 md:col-span-12">
                <button type="submit" className="btn-primary text-xs">
                  Save gate
                </button>
                <Chip value={g.result} label={IST_RESULT_LABEL[g.result]} />
                <ConfirmActionButton
                  action={deleteIstGate}
                  fields={{ id: g.id }}
                  label="Delete"
                  confirm="Delete this IST / energization gate?"
                />
              </div>
            </form>
          ))}
        </div>
      )}

      <form action={createIstGate} className="panel grid gap-3 p-4 md:grid-cols-3">
        <input type="hidden" name="projectId" value={projectId} />
        <label className="md:col-span-2">
          <span className="label">New IST / energization gate</span>
          <input name="title" required className="field" placeholder="e.g. Sync-check relays (dead-bus / live-bus)" />
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-ghost">
            Add gate
          </button>
        </div>
      </form>
    </div>
  );
}
