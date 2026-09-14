import { getDb } from "./db";
import type {
  DashboardStats,
  ItpItem,
  Project,
  Punch,
  PunchFilters,
  PunchRow,
  System,
  SystemRow,
} from "./types";

type ProjectRow = {
  id: string;
  name: string;
  site: string;
  client: string;
  vertical: Project["vertical"];
  status: Project["status"];
  created_at: string;
  updated_at: string;
};

type SystemSql = {
  id: string;
  project_id: string;
  name: string;
  tag: string;
  discipline: string;
  status: System["status"];
  created_at: string;
  updated_at: string;
  open_punches?: number;
  a_punches?: number;
  itp_total?: number;
  itp_complete?: number;
};

type PunchSql = {
  id: string;
  project_id: string;
  system_id: string;
  number: number;
  title: string;
  description: string;
  severity: Punch["severity"];
  status: Punch["status"];
  owner: string;
  due_date: string | null;
  evidence_notes: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  system_tag?: string;
  system_name?: string;
  project_name?: string;
};

type ItpSql = {
  id: string;
  project_id: string;
  system_id: string;
  step_number: number;
  title: string;
  procedure_ref: string;
  result: ItpItem["result"];
  notes: string;
  created_at: string;
  updated_at: string;
};

function mapProject(r: ProjectRow): Project {
  return {
    id: r.id,
    name: r.name,
    site: r.site,
    client: r.client,
    vertical: r.vertical,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapSystem(r: SystemSql): System {
  return {
    id: r.id,
    projectId: r.project_id,
    name: r.name,
    tag: r.tag,
    discipline: r.discipline,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapPunch(r: PunchSql): Punch {
  return {
    id: r.id,
    projectId: r.project_id,
    systemId: r.system_id,
    number: r.number,
    title: r.title,
    description: r.description,
    severity: r.severity,
    status: r.status,
    owner: r.owner,
    dueDate: r.due_date,
    evidenceNotes: r.evidence_notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    closedAt: r.closed_at,
  };
}

function mapPunchRow(r: PunchSql): PunchRow {
  return {
    ...mapPunch(r),
    systemTag: r.system_tag ?? "",
    systemName: r.system_name ?? "",
    projectName: r.project_name ?? "",
  };
}

function mapItp(r: ItpSql): ItpItem {
  return {
    id: r.id,
    projectId: r.project_id,
    systemId: r.system_id,
    stepNumber: r.step_number,
    title: r.title,
    procedureRef: r.procedure_ref,
    result: r.result,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listProjects(): Project[] {
  const rows = getDb()
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as ProjectRow[];
  return rows.map(mapProject);
}

export function getProject(id: string): Project | null {
  const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow | undefined;
  return row ? mapProject(row) : null;
}

export function listSystems(projectId: string): SystemRow[] {
  const rows = getDb()
    .prepare(
      `SELECT s.*,
        (SELECT COUNT(*) FROM punches p WHERE p.system_id = s.id AND p.status != 'closed') AS open_punches,
        (SELECT COUNT(*) FROM punches p WHERE p.system_id = s.id AND p.status != 'closed' AND p.severity = 'A') AS a_punches,
        (SELECT COUNT(*) FROM itp_items i WHERE i.system_id = s.id) AS itp_total,
        (SELECT COUNT(*) FROM itp_items i WHERE i.system_id = s.id AND i.result IN ('pass','na')) AS itp_complete
       FROM systems s
       WHERE s.project_id = ?
       ORDER BY s.tag COLLATE NOCASE`,
    )
    .all(projectId) as SystemSql[];

  return rows.map((r) => ({
    ...mapSystem(r),
    openPunches: r.open_punches ?? 0,
    aPunches: r.a_punches ?? 0,
    itpTotal: r.itp_total ?? 0,
    itpComplete: r.itp_complete ?? 0,
  }));
}

export function getSystem(id: string): System | null {
  const row = getDb().prepare("SELECT * FROM systems WHERE id = ?").get(id) as SystemSql | undefined;
  return row ? mapSystem(row) : null;
}

export function listAllSystems(): System[] {
  const rows = getDb()
    .prepare("SELECT * FROM systems ORDER BY tag COLLATE NOCASE")
    .all() as SystemSql[];
  return rows.map(mapSystem);
}

export function nextPunchNumber(projectId: string): number {
  const row = getDb()
    .prepare("SELECT COALESCE(MAX(number), 0) + 1 AS n FROM punches WHERE project_id = ?")
    .get(projectId) as { n: number };
  return row.n;
}

const PUNCH_SELECT = `
  SELECT p.*, s.tag AS system_tag, s.name AS system_name, pr.name AS project_name
  FROM punches p
  JOIN systems s ON s.id = p.system_id
  JOIN projects pr ON pr.id = p.project_id
`;

export function listPunches(filters: PunchFilters = {}): PunchRow[] {
  const where: string[] = ["1=1"];
  const params: Record<string, string> = {};

  if (filters.projectId) {
    where.push("p.project_id = @projectId");
    params.projectId = filters.projectId;
  }
  if (filters.systemId) {
    where.push("p.system_id = @systemId");
    params.systemId = filters.systemId;
  }
  if (filters.severity) {
    where.push("p.severity = @severity");
    params.severity = filters.severity;
  }
  if (filters.status) {
    where.push("p.status = @status");
    params.status = filters.status;
  }
  if (filters.owner) {
    where.push("p.owner LIKE @owner");
    params.owner = `%${filters.owner}%`;
  }
  if (filters.q) {
    where.push(
      "(p.title LIKE @q OR p.description LIKE @q OR p.owner LIKE @q OR s.tag LIKE @q OR printf('CX-%03d', p.number) LIKE @q)",
    );
    params.q = `%${filters.q}%`;
  }

  const order = `CASE p.status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
                 CASE p.severity WHEN 'A' THEN 0 WHEN 'B' THEN 1 ELSE 2 END,
                 p.due_date IS NULL, p.due_date, p.number`;

  const rows = getDb()
    .prepare(`${PUNCH_SELECT} WHERE ${where.join(" AND ")} ORDER BY ${order}`)
    .all(params) as PunchSql[];
  return rows.map(mapPunchRow);
}

export function getPunch(id: string): PunchRow | null {
  const row = getDb().prepare(`${PUNCH_SELECT} WHERE p.id = ?`).get(id) as PunchSql | undefined;
  return row ? mapPunchRow(row) : null;
}

export function listItp(systemId: string): ItpItem[] {
  const rows = getDb()
    .prepare("SELECT * FROM itp_items WHERE system_id = ? ORDER BY step_number")
    .all(systemId) as ItpSql[];
  return rows.map(mapItp);
}

export function getDashboardStats(projectId?: string): DashboardStats {
  const db = getDb();
  const scope = projectId ? "WHERE project_id = ?" : "";
  const args = projectId ? [projectId] : [];

  const punchAgg = db
    .prepare(
      `SELECT
        SUM(CASE WHEN status != 'closed' THEN 1 ELSE 0 END) AS open_punches,
        SUM(CASE WHEN status != 'closed' AND severity = 'A' THEN 1 ELSE 0 END) AS a_open,
        SUM(CASE WHEN status != 'closed' AND due_date IS NOT NULL AND due_date < date('now') THEN 1 ELSE 0 END) AS overdue,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed_punches
       FROM punches ${scope}`,
    )
    .get(...args) as {
    open_punches: number | null;
    a_open: number | null;
    overdue: number | null;
    in_progress: number | null;
    closed_punches: number | null;
  };

  const itpAgg = db
    .prepare(
      `SELECT
        COUNT(*) AS itp_total,
        SUM(CASE WHEN result = 'pending' THEN 1 ELSE 0 END) AS itp_pending,
        SUM(CASE WHEN result = 'pass' THEN 1 ELSE 0 END) AS itp_pass
       FROM itp_items ${scope}`,
    )
    .get(...args) as { itp_total: number | null; itp_pending: number | null; itp_pass: number | null };

  const projectCount = projectId
    ? 1
    : (db.prepare("SELECT COUNT(*) AS c FROM projects").get() as { c: number }).c;

  return {
    projectCount,
    openPunches: punchAgg.open_punches ?? 0,
    aOpen: punchAgg.a_open ?? 0,
    overdue: punchAgg.overdue ?? 0,
    inProgress: punchAgg.in_progress ?? 0,
    closedPunches: punchAgg.closed_punches ?? 0,
    itpPending: itpAgg.itp_pending ?? 0,
    itpPass: itpAgg.itp_pass ?? 0,
    itpTotal: itpAgg.itp_total ?? 0,
  };
}

export function listOwners(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT owner FROM punches ORDER BY owner COLLATE NOCASE")
    .all() as { owner: string }[];
  return rows.map((r) => r.owner);
}

export function countPunchesBySeverity(projectId?: string) {
  const scope = projectId ? "WHERE project_id = ? AND status != 'closed'" : "WHERE status != 'closed'";
  const args = projectId ? [projectId] : [];
  const rows = getDb()
    .prepare(`SELECT severity, COUNT(*) AS c FROM punches ${scope} GROUP BY severity`)
    .all(...args) as { severity: "A" | "B" | "C"; c: number }[];
  const map = { A: 0, B: 0, C: 0 };
  for (const r of rows) map[r.severity] = r.c;
  return map;
}
