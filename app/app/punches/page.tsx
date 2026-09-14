import { PunchFilters } from "@/components/punch-filters";
import { PunchForm } from "@/components/punch-form";
import { PunchTable } from "@/components/punch-table";
import { listAllSystems, listProjects, listPunches } from "@/lib/queries";
import type { PunchFilters as Filters, PunchSeverity, PunchStatus } from "@/lib/types";
import Link from "next/link";

export const metadata = { title: "Punches" };

export default async function PunchesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const filters: Filters = {
    projectId: pick("projectId") || undefined,
    systemId: pick("systemId") || undefined,
    severity: (pick("severity") as PunchSeverity) || undefined,
    status: (pick("status") as PunchStatus) || undefined,
    q: pick("q") || undefined,
  };

  const projects = listProjects();
  const systems = listAllSystems();
  const punches = listPunches(filters);
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v) qs.set(k, v);
  }
  const exportHref = `/app/punches/export${qs.toString() ? `?${qs}` : ""}`;
  const printHref = `/app/punches/print${qs.toString() ? `?${qs}` : ""}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Deficiencies</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">Punch list</h1>
          <p className="mt-2 text-sm text-ink-300">{punches.length} items in this view. Close only with evidence.</p>
        </div>
        <div className="flex gap-2">
          <Link href={printHref} className="btn-ghost">
            Print
          </Link>
          <Link href={exportHref} className="btn-primary">
            Export CSV
          </Link>
        </div>
      </div>

      <PunchFilters filters={filters} projects={projects} systems={systems} />
      <PunchTable punches={punches} showProject={projects.length > 1} />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Raise a punch</h2>
        <PunchForm
          projects={projects}
          systems={systems}
          defaultProjectId={filters.projectId}
          defaultSystemId={filters.systemId}
        />
      </section>
    </div>
  );
}
