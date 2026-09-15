import { ConfirmSubmit } from "@/components/confirm-submit";
import { ItpEditor } from "@/components/itp-editor";
import { PunchForm } from "@/components/punch-form";
import { PunchTable } from "@/components/punch-table";
import { SystemForm } from "@/components/system-form";
import { SystemStatusChip } from "@/components/chips";
import { deleteSystem } from "@/lib/actions";
import { getProject, getSystem, listItp, listPunches } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "System" };

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string; systemId: string }>;
}) {
  const { id, systemId } = await params;
  const project = getProject(id);
  const system = getSystem(systemId);
  if (!project || !system || system.projectId !== id) notFound();

  const punches = listPunches({ systemId });
  const itp = listItp(systemId);

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/app/projects/${id}`} className="text-xs font-medium text-volt hover:underline">
          ← {project.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-volt">{system.tag}</p>
            <h1 className="text-3xl font-semibold text-white">{system.name}</h1>
            <p className="mt-1 text-sm text-ink-300">{system.discipline}</p>
            <div className="mt-3">
              <SystemStatusChip value={system.status} />
            </div>
          </div>
          <ConfirmSubmit
            action={deleteSystem}
            label="Delete system"
            confirm="Delete this system, its punches, ITP rows, and photo evidence?"
          >
            <input type="hidden" name="id" value={system.id} />
            <input type="hidden" name="projectId" value={id} />
          </ConfirmSubmit>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Punches</h2>
        <PunchTable punches={punches} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Raise punch on {system.tag}</h2>
        <PunchForm
          projects={[project]}
          systems={[system]}
          defaultProjectId={id}
          defaultSystemId={systemId}
          returnTo={`/app/projects/${id}/systems/${systemId}`}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Inspection / test plan</h2>
        <p className="mb-3 text-sm text-ink-400">
          Living ITP. Pass, fail, N/A, or pending — with the procedure ref the closeout pack will cite.
        </p>
        <ItpEditor items={itp} projectId={id} systemId={systemId} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Rename / edit system</h2>
        <SystemForm projectId={id} system={system} />
      </section>
    </div>
  );
}
