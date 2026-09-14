import { randomUUID } from "crypto";

export function uid(prefix = "id"): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.length <= 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === "closed") return false;
  const due = dueDate.length <= 10 ? new Date(`${dueDate}T23:59:59`) : new Date(dueDate);
  return due.getTime() < Date.now();
}

export function punchCode(number: number): string {
  return `CX-${String(number).padStart(3, "0")}`;
}

export function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const VERTICAL_LABEL: Record<string, string> = {
  data_center: "Data center",
  power_plant: "Power plant",
};

export const PROJECT_STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  active: "Active",
  punch_out: "Punch-out",
  closed: "Closed",
};

export const SYSTEM_STATUS_LABEL: Record<string, string> = {
  not_started: "Not started",
  in_test: "In test",
  punch: "Punch",
  accepted: "Accepted",
};

export const PUNCH_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export const ITP_RESULT_LABEL: Record<string, string> = {
  pending: "Pending",
  pass: "Pass",
  fail: "Fail",
  na: "N/A",
};

export const DISCIPLINES = [
  "Electrical",
  "Mechanical",
  "Controls",
  "Fire/life safety",
  "Civil",
  "Cx / IST",
] as const;
