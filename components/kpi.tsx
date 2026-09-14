import type { DashboardStats } from "@/lib/types";

export function Kpi({
  label,
  value,
  hint,
  alert = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div className={`panel p-4 ${alert ? "shadow-volt" : ""}`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">{label}</p>
      <p className={`mt-2 font-mono text-3xl font-semibold ${alert ? "text-red-300" : "text-white"}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function KpiGrid({ stats }: { stats: DashboardStats }) {
  const itpPct = stats.itpTotal === 0 ? 0 : Math.round(((stats.itpTotal - stats.itpPending) / stats.itpTotal) * 100);
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi label="Open punches" value={stats.openPunches} hint={`${stats.inProgress} in progress`} />
      <Kpi label="A-deficiencies" value={stats.aOpen} hint="COD / safety blockers" alert={stats.aOpen > 0} />
      <Kpi label="Overdue" value={stats.overdue} hint="Past due and still open" alert={stats.overdue > 0} />
      <Kpi label="ITP complete" value={`${itpPct}%`} hint={`${stats.itpPass} pass · ${stats.itpPending} pending`} />
    </div>
  );
}
