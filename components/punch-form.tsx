"use client";

import { createPunch } from "@/lib/actions";
import type { Project, System } from "@/lib/types";
import { useMemo, useState } from "react";

export function PunchForm({
  projects,
  systems,
  defaultProjectId,
  defaultSystemId,
  returnTo = "/app/punches",
}: {
  projects: Project[];
  systems: System[];
  defaultProjectId?: string;
  defaultSystemId?: string;
  returnTo?: string;
}) {
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? "");
  const scoped = useMemo(
    () => systems.filter((s) => s.projectId === projectId),
    [systems, projectId],
  );
  const [systemId, setSystemId] = useState(defaultSystemId ?? scoped[0]?.id ?? "");

  return (
    <form action={createPunch} className="panel grid gap-4 p-5 md:grid-cols-2">
      <input type="hidden" name="returnTo" value={returnTo} />
      <label>
        <span className="label">Project</span>
        <select
          name="projectId"
          required
          value={projectId}
          onChange={(e) => {
            const next = e.target.value;
            setProjectId(next);
            const first = systems.find((s) => s.projectId === next);
            setSystemId(first?.id ?? "");
          }}
          className="field"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">System</span>
        <select
          name="systemId"
          required
          value={systemId}
          onChange={(e) => setSystemId(e.target.value)}
          className="field"
        >
          {scoped.map((s) => (
            <option key={s.id} value={s.id}>
              {s.tag} — {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2">
        <span className="label">Title</span>
        <input name="title" required className="field" placeholder="What is deficient, in one line" />
      </label>
      <label className="md:col-span-2">
        <span className="label">Description</span>
        <textarea
          name="description"
          rows={3}
          className="field"
          placeholder="Test context, observed result, why it matters for COD / IST."
        />
      </label>
      <label>
        <span className="label">Severity</span>
        <select name="severity" defaultValue="B" className="field">
          <option value="A">A — Safety / COD blocker</option>
          <option value="B">B — Correct before IST / substantial completion</option>
          <option value="C">C — Document, as-built, non-blocking</option>
        </select>
      </label>
      <label>
        <span className="label">Owner</span>
        <input name="owner" required className="field" placeholder="Name / trade — e.g. Chen (CxA)" />
      </label>
      <label>
        <span className="label">Due date</span>
        <input type="date" name="dueDate" className="field" />
      </label>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full md:w-auto">
          Raise punch
        </button>
      </div>
    </form>
  );
}
