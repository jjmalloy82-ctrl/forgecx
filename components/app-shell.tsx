"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLink } from "./brand";
import { ResetDemoButton } from "./reset-demo";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/punches", label: "Punches" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="no-print border-b border-ink-700 bg-ink-900/90 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-5 lg:py-6">
          <BrandLink href="/app" compact />
          <span className="chip bg-volt/10 text-volt ring-1 ring-volt/30 lg:mt-4">Demo mode</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {NAV.map((item) => {
            const active = item.href === "/app" ? path === "/app" : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-11 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium ${
                  active
                    ? "bg-ink-800 text-white shadow-volt"
                    : "text-ink-300 hover:bg-ink-800/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-4 pb-6 lg:block">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">Job pack</p>
          <div className="flex flex-col gap-2">
            <Link href="/app/punches/print" className="btn-ghost text-xs">
              Print punch list
            </Link>
            <Link href="/app/punches/export" className="btn-ghost text-xs">
              Export CSV
            </Link>
            <ResetDemoButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="no-print flex min-h-14 items-center justify-between gap-3 border-b border-ink-700 bg-ink-900/60 px-4 py-3 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
            Field ops · single-tenant demo · no login
          </p>
          <Link href="/" className="text-xs font-medium text-ink-400 hover:text-volt">
            Marketing site
          </Link>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
