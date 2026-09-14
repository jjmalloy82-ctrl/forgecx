import { PunchStatusChip, SeverityChip } from "@/components/chips";
import { PrintButton } from "@/components/print-button";
import { listPunches } from "@/lib/queries";
import { formatDate, isOverdue, punchCode } from "@/lib/utils";
import type { PunchSeverity, PunchStatus } from "@/lib/types";
import Link from "next/link";

export const metadata = { title: "Print punches" };

export default async function PrintPunchesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const punches = listPunches({
    projectId: pick("projectId") || undefined,
    systemId: pick("systemId") || undefined,
    severity: (pick("severity") as PunchSeverity) || undefined,
    status: (pick("status") as PunchStatus) || undefined,
    q: pick("q") || undefined,
  });

  return (
    <div className="print-sheet space-y-6">
      <div className="no-print flex items-center justify-between">
        <Link href="/app/punches" className="text-sm text-volt hover:underline">
          ← Back to board
        </Link>
        <PrintButton />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-volt print:text-black">ForgeCX punch list</p>
        <h1 className="mt-1 text-3xl font-semibold text-white print:text-black">{punches.length} items</h1>
      </div>
      <div className="overflow-hidden rounded-xl border border-ink-700 print:border-neutral-400">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-800/80 font-mono text-[11px] uppercase tracking-wider text-ink-400 print:bg-neutral-100 print:text-black">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">System</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Sev</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Due</th>
              <th className="px-3 py-2">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {punches.map((p) => (
              <tr key={p.id} className="border-b border-ink-800 print:border-neutral-300">
                <td className="px-3 py-2 font-mono">{punchCode(p.number)}</td>
                <td className="px-3 py-2 font-mono">{p.systemTag}</td>
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">
                  <SeverityChip value={p.severity} />
                </td>
                <td className="px-3 py-2">
                  <PunchStatusChip value={p.status} />
                </td>
                <td className="px-3 py-2">{p.owner}</td>
                <td className={`px-3 py-2 ${isOverdue(p.dueDate, p.status) ? "text-red-300 print:font-bold" : ""}`}>
                  {formatDate(p.dueDate)}
                </td>
                <td className="max-w-xs px-3 py-2 text-xs text-ink-300 print:text-neutral-700">
                  {p.evidenceNotes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 print:text-neutral-500">
        ForgeCX closeout extract · not a substitute for signed ITP sheets
      </p>
    </div>
  );
}
