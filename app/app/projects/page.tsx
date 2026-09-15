import { EmptyState } from "@/components/empty-state";
import { ProjectForm } from "@/components/project-form";
import { ProjectStatusChip, VerticalChip } from "@/components/chips";
import { getDashboardStats, listProjects } from "@/lib/queries";
import Link from "next/link";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = listProjects();

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Sites</p>
        <h1 className="mt-1 text-3xl font-semibold text-white">Projects</h1>
        <p className="mt-2 text-sm text-ink-300">Create, rename, or open a commissioning job.</p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="Reset demo data to restore Columbiana DC and Nantong Cogen, or create a job below."
        />
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const stats = getDashboardStats(p.id);
          return (
            <Link key={p.id} href={`/app/projects/${p.id}`} className="panel block p-5 transition hover:shadow-volt">
              <div className="flex flex-wrap gap-2">
                <VerticalChip value={p.vertical} />
                <ProjectStatusChip value={p.status} />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{p.name}</h2>
              <p className="mt-1 text-sm text-ink-300">
                {p.site} · {p.client}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-400">
                {stats.openPunches} open punches · {stats.aOpen} A · {stats.itpPending} ITP pending
              </p>
            </Link>
          );
        })}
      </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">New project</h2>
        <ProjectForm />
      </section>
    </div>
  );
}
