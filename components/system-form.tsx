import { createSystem, updateSystem } from "@/lib/actions";
import { DISCIPLINES, SYSTEM_STATUS_LABEL } from "@/lib/utils";
import type { System } from "@/lib/types";

export function SystemForm({
  projectId,
  system,
}: {
  projectId: string;
  system?: System;
}) {
  const action = system ? updateSystem : createSystem;
  return (
    <form action={action} className="panel grid gap-4 p-5 md:grid-cols-2">
      <input type="hidden" name="projectId" value={projectId} />
      {system ? <input type="hidden" name="id" value={system.id} /> : null}
      <label>
        <span className="label">Tag</span>
        <input name="tag" required defaultValue={system?.tag} className="field font-mono" placeholder="UPS-A" />
      </label>
      <label>
        <span className="label">Name</span>
        <input name="name" required defaultValue={system?.name} className="field" placeholder="Uninterruptible Power Supply A" />
      </label>
      <label>
        <span className="label">Discipline</span>
        <select name="discipline" defaultValue={system?.discipline ?? "Electrical"} className="field">
          {DISCIPLINES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Status</span>
        <select name="status" defaultValue={system?.status ?? "not_started"} className="field">
          {Object.entries(SYSTEM_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary">
          {system ? "Save system" : "Add system"}
        </button>
      </div>
    </form>
  );
}
