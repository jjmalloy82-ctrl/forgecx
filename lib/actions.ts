"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, resetDatabase } from "./db";
import { nextPunchNumber } from "./queries";
import type { ItpResult, ProjectStatus, PunchSeverity, PunchStatus, SystemStatus, Vertical } from "./types";
import { nowIso, uid } from "./utils";

function revalidateAll() {
  revalidatePath("/", "layout");
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function optDate(form: FormData, key: string): string | null {
  const v = str(form, key);
  return v ? v : null;
}

export async function createProject(formData: FormData) {
  const name = str(formData, "name");
  const site = str(formData, "site");
  const client = str(formData, "client");
  const vertical = str(formData, "vertical") as Vertical;
  const status = (str(formData, "status") || "planning") as ProjectStatus;
  if (!name || !site || !client) throw new Error("Name, site, and client are required.");
  if (vertical !== "data_center" && vertical !== "power_plant") throw new Error("Invalid vertical.");

  const id = uid("prj");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO projects (id, name, site, client, vertical, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, name, site, client, vertical, status, ts, ts);
  revalidateAll();
  redirect(`/app/projects/${id}`);
}

export async function updateProject(formData: FormData) {
  const id = str(formData, "id");
  const name = str(formData, "name");
  const site = str(formData, "site");
  const client = str(formData, "client");
  const vertical = str(formData, "vertical") as Vertical;
  const status = str(formData, "status") as ProjectStatus;
  if (!id || !name) throw new Error("Project name is required.");

  getDb()
    .prepare(
      `UPDATE projects SET name=?, site=?, client=?, vertical=?, status=?, updated_at=? WHERE id=?`,
    )
    .run(name, site, client, vertical, status, nowIso(), id);
  revalidateAll();
}

export async function deleteProject(formData: FormData) {
  const id = str(formData, "id");
  getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  revalidateAll();
  redirect("/app/projects");
}

export async function createSystem(formData: FormData) {
  const projectId = str(formData, "projectId");
  const name = str(formData, "name");
  const tag = str(formData, "tag");
  const discipline = str(formData, "discipline") || "Electrical";
  const status = (str(formData, "status") || "not_started") as SystemStatus;
  if (!projectId || !name || !tag) throw new Error("System name and tag are required.");

  const id = uid("sys");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO systems (id, project_id, name, tag, discipline, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, projectId, name, tag, discipline, status, ts, ts);
  revalidateAll();
  redirect(`/app/projects/${projectId}/systems/${id}`);
}

export async function updateSystem(formData: FormData) {
  const id = str(formData, "id");
  const projectId = str(formData, "projectId");
  const name = str(formData, "name");
  const tag = str(formData, "tag");
  const discipline = str(formData, "discipline");
  const status = str(formData, "status") as SystemStatus;
  if (!id || !name || !tag) throw new Error("System name and tag are required.");

  getDb()
    .prepare(
      `UPDATE systems SET name=?, tag=?, discipline=?, status=?, updated_at=? WHERE id=?`,
    )
    .run(name, tag, discipline, status, nowIso(), id);
  revalidateAll();
  redirect(`/app/projects/${projectId}/systems/${id}`);
}

export async function deleteSystem(formData: FormData) {
  const id = str(formData, "id");
  const projectId = str(formData, "projectId");
  getDb().prepare("DELETE FROM systems WHERE id = ?").run(id);
  revalidateAll();
  redirect(`/app/projects/${projectId}`);
}

export async function createPunch(formData: FormData) {
  const projectId = str(formData, "projectId");
  const systemId = str(formData, "systemId");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const severity = (str(formData, "severity") || "B") as PunchSeverity;
  const owner = str(formData, "owner");
  if (!owner) throw new Error("Owner is required.");
  const dueDate = optDate(formData, "dueDate");
  const returnTo = str(formData, "returnTo") || "/app/punches";
  if (!projectId || !systemId || !title) throw new Error("Project, system, and title are required.");

  const id = uid("pnch");
  const ts = nowIso();
  const number = nextPunchNumber(projectId);
  getDb()
    .prepare(
      `INSERT INTO punches (
        id, project_id, system_id, number, title, description, severity, status,
        owner, due_date, evidence_notes, created_at, updated_at, closed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, '', ?, ?, NULL)`,
    )
    .run(id, projectId, systemId, number, title, description, severity, owner, dueDate, ts, ts);
  revalidateAll();
  if (returnTo && !returnTo.startsWith("/app/punches")) {
    redirect(returnTo);
  }
  redirect(`/app/punches/${id}`);
}

export async function updatePunch(formData: FormData) {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const severity = str(formData, "severity") as PunchSeverity;
  const status = str(formData, "status") as PunchStatus;
  const owner = str(formData, "owner");
  const dueDate = optDate(formData, "dueDate");
  const evidenceNotes = str(formData, "evidenceNotes");

  if (!id || !title) throw new Error("Title is required.");
  if (status === "closed" && !evidenceNotes) {
    throw new Error("Closing a punch requires evidence notes.");
  }

  const existing = getDb()
    .prepare("SELECT status FROM punches WHERE id = ?")
    .get(id) as { status: PunchStatus } | undefined;
  if (!existing) throw new Error("Punch not found.");

  const closing = status === "closed" && existing.status !== "closed";
  const reopening = status !== "closed" && existing.status === "closed";
  const closedAt = closing ? nowIso() : reopening ? null : undefined;

  if (closedAt === undefined) {
    getDb()
      .prepare(
        `UPDATE punches SET title=?, description=?, severity=?, status=?, owner=?, due_date=?, evidence_notes=?, updated_at=?
         WHERE id=?`,
      )
      .run(title, description, severity, status, owner, dueDate, evidenceNotes, nowIso(), id);
  } else {
    getDb()
      .prepare(
        `UPDATE punches SET title=?, description=?, severity=?, status=?, owner=?, due_date=?, evidence_notes=?, updated_at=?, closed_at=?
         WHERE id=?`,
      )
      .run(title, description, severity, status, owner, dueDate, evidenceNotes, nowIso(), closedAt, id);
  }
  revalidateAll();
}

export async function setPunchStatus(formData: FormData) {
  const id = str(formData, "id");
  const status = str(formData, "status") as PunchStatus;
  const evidenceNotes = str(formData, "evidenceNotes");
  if (!id) throw new Error("Missing punch.");
  if (status === "closed" && !evidenceNotes) {
    throw new Error("Closing a punch requires evidence notes.");
  }

  const ts = nowIso();
  if (status === "closed") {
    getDb()
      .prepare(
        `UPDATE punches SET status='closed', evidence_notes=?, closed_at=?, updated_at=? WHERE id=?`,
      )
      .run(evidenceNotes, ts, ts, id);
  } else {
    getDb()
      .prepare(`UPDATE punches SET status=?, closed_at=NULL, updated_at=? WHERE id=?`)
      .run(status, ts, id);
  }
  revalidateAll();
}

export async function deletePunch(formData: FormData) {
  const id = str(formData, "id");
  const returnTo = str(formData, "returnTo") || "/app/punches";
  getDb().prepare("DELETE FROM punches WHERE id = ?").run(id);
  revalidateAll();
  redirect(returnTo);
}

export async function updateItpItem(formData: FormData) {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const procedureRef = str(formData, "procedureRef");
  const result = str(formData, "result") as ItpResult;
  const notes = str(formData, "notes");
  const stepNumber = Number(str(formData, "stepNumber") || "1");
  if (!id) throw new Error("Missing ITP item.");

  getDb()
    .prepare(
      `UPDATE itp_items SET title=?, procedure_ref=?, result=?, notes=?, step_number=?, updated_at=? WHERE id=?`,
    )
    .run(title, procedureRef, result, notes, stepNumber, nowIso(), id);
  revalidateAll();
}

export async function createItpItem(formData: FormData) {
  const projectId = str(formData, "projectId");
  const systemId = str(formData, "systemId");
  const title = str(formData, "title");
  const procedureRef = str(formData, "procedureRef");
  if (!projectId || !systemId || !title) throw new Error("ITP title is required.");

  const row = getDb()
    .prepare("SELECT COALESCE(MAX(step_number), 0) + 1 AS n FROM itp_items WHERE system_id = ?")
    .get(systemId) as { n: number };
  const id = uid("itp");
  const ts = nowIso();
  getDb()
    .prepare(
      `INSERT INTO itp_items (id, project_id, system_id, step_number, title, procedure_ref, result, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', '', ?, ?)`,
    )
    .run(id, projectId, systemId, row.n, title, procedureRef, ts, ts);
  revalidateAll();
}

export async function deleteItpItem(formData: FormData) {
  const id = str(formData, "id");
  getDb().prepare("DELETE FROM itp_items WHERE id = ?").run(id);
  revalidateAll();
}

export async function resetDemoData() {
  resetDatabase();
  revalidateAll();
  redirect("/app");
}
