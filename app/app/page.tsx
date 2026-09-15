import { KpiGrid } from "@/components/kpi";
import { PunchTable } from "@/components/punch-table";
import { EmptyState } from "@/components/empty-state";
import { ProjectStatusChip, VerticalChip } from "@/components/chips";
import { countPunchesBySeverity, getDashboardStats, listIstGates, listProjects, listPunches, listSystems } from "@/lib/queries";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const projects = listProjects();
  const stats = getDashboardStats();
  const punches = listPunches().slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Mission control</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">Job board</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-300">
            Two live jobs: Columbiana DC (DataQuestCX) and Nantong Cogen (FQE Power). Punches, ITP, IST gates, photo evidence.
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

      {projects.length === 0 ? (
        <EmptyState
          title="No jobs on the board"
          body="Reset demo data to restore Columbiana DC and Nantong Cogen, or create a project."
          actionHref="/app/projects"
          actionLabel="Projects"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p) => {
            const ps = getDashboardStats(p.id);
            const sev = countPunchesBySeverity(p.id);
            const systems = listSystems(p.id);
            const gates = listIstGates(p.id);
            const istFail = gates.filter((g) => g.result === "fail").length;
            return (
              <article key={p.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">{p.client}</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{p.name}</h2>
                    <p className="mt-1 text-sm text-ink-300">{p.site}</p>
                  </div>
                  <div className="flex gap-2">
                    <VerticalChip value={p.vertical} />
                    <ProjectStatusChip value={p.status} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
                  <div>
                    <span className="text-red-300">{sev.A}</span>
                    <span className="ml-2 text-ink-400">Sev A open</span>
                  </div>
                  <div>
                    <span className="text-amber-200">{sev.B}</span>
                    <span className="ml-2 text-ink-400">Sev B open</span>
                  </div>
                  <div>
                    <span className={istFail ? "text-red-300" : "text-emerald-300"}>{istFail}</span>
                    <span className="ml-2 text-ink-400">IST fail</span>
                  </div>
                  <div>
                    <span className="text-ink-200">{ps.itpPending}</span>
                    <span className="ml-2 text-ink-400">ITP pending</span>
                  </div>
                </div>
                <p className="mt-3 font-mono text-xs text-ink-500">{systems.length} systems</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/app/projects/${p.id}`} className="btn-primary text-xs">
                    Open job
                  </Link>
                  <a href={`/app/projects/${p.id}/pilot-pack`} className="btn-ghost text-xs">
                    Pilot pack
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Priority punches</h2>
          <Link href="/app/punches" className="text-sm text-volt hover:underline">
            Full list
          </Link>
        </div>
        <PunchTable punches={punches} showProject={projects.length > 1} />
      </section>
    </div>
  );
}
