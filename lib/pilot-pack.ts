import { readEvidenceFile } from "./evidence";
import {
  getDashboardStats,
  getProject,
  listEvidence,
  listIstGates,
  listItpByProject,
  listPunches,
  listSystems,
} from "./queries";
import { formatDate, IST_RESULT_LABEL, ITP_RESULT_LABEL, punchCode, VERTICAL_LABEL } from "./utils";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dataUri(mime: string, bytes: Buffer): string {
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export function buildPilotPackHtml(projectId: string): { filename: string; html: string } | null {
  const project = getProject(projectId);
  if (!project) return null;

  const stats = getDashboardStats(projectId);
  const systems = listSystems(projectId);
  const gates = listIstGates(projectId);
  const itp = listItpByProject(projectId);
  const openAB = listPunches({ projectId }).filter(
    (p) => p.status !== "closed" && (p.severity === "A" || p.severity === "B"),
  );

  const punchBlocks = openAB
    .map((p) => {
      const photos = listEvidence(p.id)
        .map((ev) => {
          const disk = readEvidenceFile(ev);
          if (!disk) return "";
          return `<img alt="${esc(ev.originalName)}" src="${dataUri(ev.mime, disk.bytes)}" style="max-width:220px;max-height:140px;object-fit:cover;border:1px solid #ccc;margin:4px 4px 0 0"/>`;
        })
        .join("");
      return `<tr>
        <td>${esc(punchCode(p.number))}</td>
        <td>${esc(p.systemTag)}</td>
        <td><strong>${esc(p.title)}</strong><div class="muted">${esc(p.description)}</div>${photos}</td>
        <td>Sev ${esc(p.severity)}</td>
        <td>${esc(p.status)}</td>
        <td>${esc(p.owner)}</td>
        <td>${esc(formatDate(p.dueDate))}</td>
      </tr>`;
    })
    .join("");

  const gateRows = gates
    .map(
      (g) =>
        `<tr><td>${g.stepNumber}</td><td>${esc(g.title)}</td><td>${esc(IST_RESULT_LABEL[g.result] ?? g.result)}</td><td>${esc(g.notes)}</td></tr>`,
    )
    .join("");

  const itpRows = itp
    .map(
      (i) =>
        `<tr><td>${esc(i.systemTag)}</td><td>${i.stepNumber}</td><td>${esc(i.title)}</td><td>${esc(i.procedureRef)}</td><td>${esc(ITP_RESULT_LABEL[i.result] ?? i.result)}</td><td>${esc(i.notes)}</td></tr>`,
    )
    .join("");

  const sysRows = systems
    .map(
      (s) =>
        `<tr><td>${esc(s.tag)}</td><td>${esc(s.name)}</td><td>${esc(s.discipline)}</td><td>${esc(s.status)}</td><td>${s.openPunches} open (${s.aPunches} A)</td><td>${s.itpComplete}/${s.itpTotal}</td></tr>`,
    )
    .join("");

  const slug = project.name.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  const filename = `ForgeCX-PilotPack-${slug}.html`;
  const generated = new Date().toISOString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>ForgeCX Pilot Pack — ${esc(project.name)}</title>
<style>
  body { font-family: system-ui, sans-serif; color: #111; margin: 32px; max-width: 1100px; }
  h1 { margin: 0 0 4px; }
  h2 { margin-top: 32px; border-bottom: 2px solid #111; padding-bottom: 4px; }
  .muted { color: #555; font-size: 13px; margin-top: 4px; }
  .kpis { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0; }
  .kpi { border: 1px solid #ccc; padding: 12px 16px; min-width: 120px; }
  .kpi b { display: block; font-size: 22px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
  th { background: #f3f3f3; }
  .brand { font-family: ui-monospace, monospace; letter-spacing: .16em; font-size: 11px; text-transform: uppercase; color: #555; }
  @media print { a { color: inherit; text-decoration: none; } }
</style>
</head>
<body>
  <p class="brand">ForgeCX pilot pack · Close the plant. Keep the proof.</p>
  <h1>${esc(project.name)}</h1>
  <p class="muted">${esc(project.site)} · ${esc(project.client)} · ${esc(VERTICAL_LABEL[project.vertical] ?? project.vertical)} · generated ${esc(generated)}</p>
  <div class="kpis">
    <div class="kpi"><span>Open A/B punches</span><b>${openAB.length}</b></div>
    <div class="kpi"><span>A open (all)</span><b>${stats.aOpen}</b></div>
    <div class="kpi"><span>IST fail</span><b>${stats.istFail}</b></div>
    <div class="kpi"><span>IST pending</span><b>${stats.istPending}</b></div>
    <div class="kpi"><span>ITP pending</span><b>${stats.itpPending}</b></div>
  </div>

  <h2>Energization / IST gates</h2>
  <table>
    <thead><tr><th>#</th><th>Gate</th><th>Result</th><th>Notes</th></tr></thead>
    <tbody>${gateRows || `<tr><td colspan="4">No IST gates.</td></tr>`}</tbody>
  </table>

  <h2>Open A/B punches</h2>
  <table>
    <thead><tr><th>ID</th><th>System</th><th>Title</th><th>Sev</th><th>Status</th><th>Owner</th><th>Due</th></tr></thead>
    <tbody>${punchBlocks || `<tr><td colspan="7">No open A/B punches — IST not blocked by punch list.</td></tr>`}</tbody>
  </table>

  <h2>Systems</h2>
  <table>
    <thead><tr><th>Tag</th><th>Name</th><th>Discipline</th><th>Status</th><th>Punches</th><th>ITP</th></tr></thead>
    <tbody>${sysRows || `<tr><td colspan="6">No systems.</td></tr>`}</tbody>
  </table>

  <h2>ITP summary</h2>
  <table>
    <thead><tr><th>System</th><th>Step</th><th>Check</th><th>Procedure</th><th>Result</th><th>Notes</th></tr></thead>
    <tbody>${itpRows || `<tr><td colspan="6">No ITP rows.</td></tr>`}</tbody>
  </table>

  <p class="muted">Not a signed ITP sheet. Attachments inlined from ForgeCX evidence store. Print to PDF if the owner wants a static pack.</p>
</body>
</html>`;

  return { filename, html };
}
