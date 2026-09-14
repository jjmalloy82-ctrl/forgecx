import { formatDate, isOverdue, punchCode } from "@/lib/utils";
import type { PunchRow } from "@/lib/types";
import Link from "next/link";
import { PunchStatusChip, SeverityChip } from "./chips";

export function PunchTable({
  punches,
  showProject = false,
}: {
  punches: PunchRow[];
  showProject?: boolean;
}) {
  if (punches.length === 0) {
    return (
      <div className="panel px-5 py-10 text-center text-sm text-ink-400">
        No punches match this filter. Raise one from a system or the punch board.
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-800/80 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              {showProject ? <th className="px-4 py-3">Project</th> : null}
              <th className="px-4 py-3">System</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Sev</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {punches.map((p) => {
              const overdue = isOverdue(p.dueDate, p.status);
              return (
                <tr key={p.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="px-4 py-3 font-mono text-volt">
                    <Link href={`/app/punches/${p.id}`} className="hover:underline">
                      {punchCode(p.number)}
                    </Link>
                  </td>
                  {showProject ? <td className="px-4 py-3 text-ink-300">{p.projectName}</td> : null}
                  <td className="px-4 py-3 font-mono text-ink-200">{p.systemTag}</td>
                  <td className="px-4 py-3">
                    <Link href={`/app/punches/${p.id}`} className="font-medium text-white hover:text-volt">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityChip value={p.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <PunchStatusChip value={p.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-300">{p.owner}</td>
                  <td className={`px-4 py-3 ${overdue ? "font-semibold text-red-300" : "text-ink-300"}`}>
                    {formatDate(p.dueDate)}
                    {overdue ? <span className="ml-2 text-[10px] uppercase tracking-wider">Overdue</span> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
