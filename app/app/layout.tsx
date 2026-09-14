import { AppShell } from "@/components/app-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
