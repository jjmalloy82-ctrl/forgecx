import { createProject, updateProject } from "@/lib/actions";
import { PROJECT_STATUS_LABEL, VERTICAL_LABEL } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project?: Project }) {
  const action = project ? updateProject : createProject;
  return (
    <form action={action} className="panel grid gap-4 p-5 md:grid-cols-2">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <label className="md:col-span-2">
        <span className="label">Project name</span>
        <input name="name" required defaultValue={project?.name} className="field" placeholder="Columbiana DC — Cx Phase" />
      </label>
      <label>
        <span className="label">Site</span>
        <input name="site" required defaultValue={project?.site} className="field" placeholder="City, state · hall / MW" />
      </label>
      <label>
        <span className="label">Client</span>
        <input name="client" required defaultValue={project?.client} className="field" placeholder="DataQuestCX" />
      </label>
      <label>
        <span className="label">Vertical</span>
        <select name="vertical" defaultValue={project?.vertical ?? "data_center"} className="field">
          {Object.entries(VERTICAL_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Status</span>
        <select name="status" defaultValue={project?.status ?? "planning"} className="field">
          {Object.entries(PROJECT_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary">
          {project ? "Save project" : "Create project"}
        </button>
      </div>
    </form>
  );
}
