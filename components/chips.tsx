import {
  ITP_RESULT_LABEL,
  PROJECT_STATUS_LABEL,
  PUNCH_STATUS_LABEL,
  SYSTEM_STATUS_LABEL,
  VERTICAL_LABEL,
} from "@/lib/utils";

const tone = {
  A: "bg-red-500/15 text-red-300 ring-1 ring-red-500/40",
  B: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/35",
  C: "bg-sky-400/10 text-sky-200 ring-1 ring-sky-400/25",
  open: "bg-volt/10 text-volt ring-1 ring-volt/40",
  in_progress: "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/35",
  closed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  pending: "bg-ink-700 text-ink-300 ring-1 ring-ink-500",
  pass: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  fail: "bg-red-500/15 text-red-300 ring-1 ring-red-500/40",
  na: "bg-ink-700 text-ink-300 ring-1 ring-ink-500",
  active: "bg-volt/10 text-volt ring-1 ring-volt/40",
  planning: "bg-ink-700 text-ink-200 ring-1 ring-ink-500",
  punch_out: "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/35",
  not_started: "bg-ink-700 text-ink-300 ring-1 ring-ink-500",
  in_test: "bg-volt/10 text-volt ring-1 ring-volt/40",
  punch: "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/35",
  accepted: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  data_center: "bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-400/25",
  power_plant: "bg-orange-500/10 text-orange-200 ring-1 ring-orange-400/30",
} as const;

export function Chip({
  value,
  label,
}: {
  value: keyof typeof tone | string;
  label?: string;
}) {
  const cls = tone[value as keyof typeof tone] ?? "bg-ink-700 text-ink-200 ring-1 ring-ink-500";
  return <span className={`chip ${cls}`}>{label ?? value}</span>;
}

export function SeverityChip({ value }: { value: "A" | "B" | "C" }) {
  return <Chip value={value} label={`Sev ${value}`} />;
}

export function PunchStatusChip({ value }: { value: "open" | "in_progress" | "closed" }) {
  return <Chip value={value} label={PUNCH_STATUS_LABEL[value]} />;
}

export function ProjectStatusChip({ value }: { value: string }) {
  return <Chip value={value} label={PROJECT_STATUS_LABEL[value] ?? value} />;
}

export function SystemStatusChip({ value }: { value: string }) {
  return <Chip value={value} label={SYSTEM_STATUS_LABEL[value] ?? value} />;
}

export function VerticalChip({ value }: { value: string }) {
  return <Chip value={value} label={VERTICAL_LABEL[value] ?? value} />;
}

export function ItpChip({ value }: { value: string }) {
  return <Chip value={value} label={ITP_RESULT_LABEL[value] ?? value} />;
}
