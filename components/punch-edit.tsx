import { setPunchStatus, updatePunch } from "@/lib/actions";
import { PUNCH_STATUS_LABEL } from "@/lib/utils";
import type { PunchRow } from "@/lib/types";

export function PunchEditForm({ punch }: { punch: PunchRow }) {
  return (
    <form key={punch.updatedAt} action={updatePunch} className="panel grid gap-4 p-5 md:grid-cols-2">
      <input type="hidden" name="id" value={punch.id} />
      <label className="md:col-span-2">
        <span className="label">Title</span>
        <input name="title" required defaultValue={punch.title} className="field" />
      </label>
      <label className="md:col-span-2">
        <span className="label">Description</span>
        <textarea name="description" rows={4} defaultValue={punch.description} className="field" />
      </label>
      <label>
        <span className="label">Severity</span>
        <select name="severity" defaultValue={punch.severity} className="field">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </label>
      <label>
        <span className="label">Status</span>
        <select name="status" defaultValue={punch.status} className="field">
          {Object.entries(PUNCH_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Owner</span>
        <input name="owner" defaultValue={punch.owner} className="field" />
      </label>
      <label>
        <span className="label">Due date</span>
        <input type="date" name="dueDate" defaultValue={punch.dueDate ?? ""} className="field" />
      </label>
      <label className="md:col-span-2">
        <span className="label">Evidence notes</span>
        <textarea
          name="evidenceNotes"
          rows={4}
          defaultValue={punch.evidenceNotes}
          className="field"
          placeholder="Required to close: what was done, who witnessed, where the photo/sheet lives."
        />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary">
          Save punch
        </button>
        <p className="mt-2 text-xs text-ink-400">Closing requires evidence notes. The closeout pack is only as good as the proof.</p>
      </div>
    </form>
  );
}

export function ClosePunchForm({ punchId }: { punchId: string }) {
  return (
    <form action={setPunchStatus} className="panel space-y-3 p-5">
      <input type="hidden" name="id" value={punchId} />
      <input type="hidden" name="status" value="closed" />
      <h3 className="text-sm font-semibold text-white">Close with evidence</h3>
      <textarea
        name="evidenceNotes"
        required
        rows={4}
        className="field"
        placeholder="Corrective action, witness, photo/sheet reference, as-left result."
      />
      <button type="submit" className="btn-primary">
        Close punch
      </button>
    </form>
  );
}

export function StartPunchForm({ punchId }: { punchId: string }) {
  return (
    <form action={setPunchStatus}>
      <input type="hidden" name="id" value={punchId} />
      <input type="hidden" name="status" value="in_progress" />
      <button type="submit" className="btn-ghost">
        Mark in progress
      </button>
    </form>
  );
}

export function ReopenPunchForm({ punchId }: { punchId: string }) {
  return (
    <form action={setPunchStatus}>
      <input type="hidden" name="id" value={punchId} />
      <input type="hidden" name="status" value="open" />
      <button type="submit" className="btn-ghost">
        Reopen
      </button>
    </form>
  );
}
