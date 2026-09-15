import type { PunchFilters } from "@/lib/types";
import type { Project, System } from "@/lib/types";

export function PunchFilters({
  filters,
  projects,
  systems,
  action = "/app/punches",
}: {
  filters: PunchFilters;
  projects: Project[];
  systems: System[];
  action?: string;
}) {
  const filteredSystems = filters.projectId
    ? systems.filter((s) => s.projectId === filters.projectId)
    : systems;

  return (
    <form action={action} method="get" className="panel grid gap-3 p-4 md:grid-cols-6">
      <label className="md:col-span-2">
        <span className="label">Search</span>
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          className="field"
          placeholder="CX-001, ATS, Chen…"
        />
      </label>
      <label>
        <span className="label">Project</span>
        <select name="projectId" defaultValue={filters.projectId ?? ""} className="field">
          <option value="">All</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">System</span>
        <select name="systemId" defaultValue={filters.systemId ?? ""} className="field">
          <option value="">All</option>
          {filteredSystems.map((s) => (
            <option key={s.id} value={s.id}>
              {s.tag}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Severity</span>
        <select name="severity" defaultValue={filters.severity ?? ""} className="field">
          <option value="">All</option>
          <option value="A">A — COD blocker</option>
          <option value="B">B — Correct before IST</option>
          <option value="C">C — Document / as-built</option>
        </select>
      </label>
      <label>
        <span className="label">Status</span>
        <select name="status" defaultValue={filters.status ?? ""} className="field">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <div className="flex items-end gap-2 md:col-span-6">
        <button type="submit" className="btn-primary">
          Apply filters
        </button>
        <a href={action} className="btn-ghost">
          Clear
        </a>
      </div>
    </form>
  );
}
