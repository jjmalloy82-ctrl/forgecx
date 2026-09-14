import { KpiGrid } from "@/components/kpi";
import { PunchTable } from "@/components/punch-table";
import { ProjectStatusChip, SystemStatusChip, VerticalChip } from "@/components/chips";
import { countPunchesBySeverity, getDashboardStats, getProject, listPunches, listProjects, listSystems } from "@/lib/queries";
import { SEED_PROJECT } from "@/lib/seed";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const projects = listProjects();
  const featured = getProject(SEED_PROJECT.id) ?? projects[0];
  const stats = getDashboardStats(featured?.id);
  const sev = countPunchesBySeverity(featured?.id);
  const punches = listPunches({ projectId: featured?.id }).slice(0, 8);
  const systems = featured ? listSystems(featured.id) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Mission control</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">Job board</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-300">
            Seeded Columbiana DC is live. Open punches, close them with evidence, filter the board, export CSV.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/punches" className="btn-primary">
            Punch board
          </Link>
          <Link href="/app/projects" className="btn-ghost">
            All projects
          </Link>
        </div>
      </div>

      <KpiGrid stats={stats} />

      <div className="grid gap-4 lg:grid-cols-3">
        {featured ? (
          <article className="panel p-5 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">Active job</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{featured.name}</h2>
                <p className="mt-1 text-sm text-ink-300">
                  {featured.site} · {featured.client}
                </p>
              </div>
              <div className="flex gap-2">
                <VerticalChip value={featured.vertical} />
                <ProjectStatusChip value={featured.status} />
              </div>
            </div>
            <div className="mt-5 flex gap-6 font-mono text-sm">
              <div>
                <span className="text-red-300">{sev.A}</span>
                <span className="ml-2 text-ink-400">Sev A open</span>
              </div>
              <div>
                <span className="text-amber-200">{sev.B}</span>
                <span className="ml-2 text-ink-400">Sev B open</span>
              </div>
              <div>
                <span className="text-sky-200">{sev.C}</span>
                <span className="ml-2 text-ink-400">Sev C open</span>
              </div>
            </div>
            <Link href={`/app/projects/${featured.id}`} className="mt-5 inline-flex text-sm font-medium text-volt hover:underline">
              Open project →
            </Link>
          </article>
        ) : (
          <article className="panel p-5 lg:col-span-2">
            <p className="text-sm text-ink-400">No projects yet.</p>
            <Link href="/app/projects" className="btn-primary mt-4">
              Create a project
            </Link>
          </article>
        )}

        <article className="panel p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">Systems</p>
          <ul className="mt-3 space-y-2">
            {systems.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <Link href={`/app/projects/${s.projectId}/systems/${s.id}`} className="font-mono text-white hover:text-volt">
                  {s.tag}
                </Link>
                <div className="flex items-center gap-2">
                  {s.openPunches > 0 ? (
                    <span className="font-mono text-xs text-amber-200">{s.openPunches} open</span>
                  ) : null}
                  <SystemStatusChip value={s.status} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Priority punches</h2>
          <Link href="/app/punches" className="text-sm text-volt hover:underline">
            Full list
          </Link>
        </div>
        <PunchTable punches={punches} />
      </section>
    </div>
  );
}
