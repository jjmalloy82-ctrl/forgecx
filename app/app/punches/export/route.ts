import { listPunches } from "@/lib/queries";
import { csvEscape, formatDate, punchCode } from "@/lib/utils";
import type { PunchSeverity, PunchStatus } from "@/lib/types";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const punches = listPunches({
    projectId: searchParams.get("projectId") || undefined,
    systemId: searchParams.get("systemId") || undefined,
    severity: (searchParams.get("severity") as PunchSeverity) || undefined,
    status: (searchParams.get("status") as PunchStatus) || undefined,
    q: searchParams.get("q") || undefined,
  });

  const header = [
    "id",
    "number",
    "project",
    "system_tag",
    "system_name",
    "title",
    "description",
    "severity",
    "status",
    "owner",
    "due_date",
    "evidence_notes",
    "created_at",
    "closed_at",
  ];

  const lines = [
    header.join(","),
    ...punches.map((p) =>
      [
        punchCode(p.number),
        p.number,
        p.projectName,
        p.systemTag,
        p.systemName,
        p.title,
        p.description,
        p.severity,
        p.status,
        p.owner,
        p.dueDate,
        p.evidenceNotes,
        formatDate(p.createdAt),
        formatDate(p.closedAt),
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="forgecx-punches.csv"',
    },
  });
}
