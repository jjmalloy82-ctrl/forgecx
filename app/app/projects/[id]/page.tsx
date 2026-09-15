import { ConfirmSubmit } from "@/components/confirm-submit";
import { EmptyState } from "@/components/empty-state";
import { IstBoard } from "@/components/ist-board";
import { ProjectForm } from "@/components/project-form";
import { PunchTable } from "@/components/punch-table";
import { SystemForm } from "@/components/system-form";
import { ProjectStatusChip, SystemStatusChip, VerticalChip } from "@/components/chips";
import { deleteProject } from "@/lib/actions";
import { getDashboardStats, getProject, listIstGates, listPunches, listSystems } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Project" };

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const systems = listSystems(id);
  const punches = listPunches({ projectId: id });
  const stats = getDashboardStats(id);
  const gates = listIstGates(id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">{project.client}</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{project.name}</h1>
          <p className="mt-2 text-sm text-ink-300">{project.site}</p>
          <div className="mt-3 flex gap-2">
            <VerticalChip value={project.vertical} />
            <ProjectStatusChip value={project.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/app/punches?projectId=${project.id}`} className="btn-primary">
            Punches ({stats.openPunches} open)
          </Link>
          <a href={`/app/projects/${project.id}/pilot-pack`} className="btn-ghost">
            Pilot pack
          </a>
          <Link href={`/app/punches/export?projectId=${project.id}`} className="btn-ghost">
            Export CSV
          </Link>
          <ConfirmSubmit
            action={deleteProject}
            label="Delete project"
            confirm="Delete this project and all systems, punches, ITP rows, IST gates, and photo evidence?"
          >
            <input type="hidden" name="id" value={project.id} />
          </ConfirmSubmit>
        </div>
      </div>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-white">IST / energization gate</h2>
          <p className="mt-1 text-sm text-ink-400">
            Hold points before first sync or integrated systems test. Fail here means the plant is not ready — even if the punch list looks quiet.
          </p>
        </div>
        <IstBoard gates={gates} projectId={id} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Systems</h2>
        {systems.length === 0 ? (
          <EmptyState
            title="No systems on this job"
            body="Add the equipment that will be tested — UPS, CRAH, turbine, switchgear — then hang punches and ITP off them."
          />
        ) : (
          <div className="overflow-hidden panel">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-ink-700 bg-ink-800/80 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                <tr>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Discipline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Open punches</th>
                  <th className="px-4 py-3">ITP</th>
                </tr>
              </thead>
              <tbody>
                {systems.map((s) => (
                  <tr key={s.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                    <td className="px-4 py-3 font-mono">
                      <Link href={`/app/projects/${id}/systems/${s.id}`} className="text-volt hover:underline">
                        {s.tag}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white">{s.name}</td>
                    <td className="px-4 py-3 text-ink-300">{s.discipline}</td>
                    <td className="px-4 py-3">
                      <SystemStatusChip value={s.status} />
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {s.openPunches}
                      {s.aPunches > 0 ? <span className="ml-2 text-red-300">{s.aPunches} A</span> : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-ink-300">
                      {s.itpComplete}/{s.itpTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Add system</h2>
        <SystemForm projectId={id} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Punches on this job</h2>
        <PunchTable punches={punches} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Rename / edit project</h2>
        <ProjectForm project={project} />
      </section>
    </div>
  );
}
