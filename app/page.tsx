import { BrandLink, Wordmark } from "@/components/brand";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "var(--tw-gradient-stops)", backgroundSize: "48px 48px" }}
      />
      <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-40" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <BrandLink href="/" />
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400 sm:block">
            Data centers · power plants
          </span>
          <Link href="/app" className="btn-primary">
            Open the job board
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-volt">Commissioning operations</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
          Close the plant.
          <br />
          <span className="text-volt">Keep the proof.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-300">
          <Wordmark /> is the field board for Cx leads who cannot afford a missing A-punch at COD.
          Punches, ITPs, and closeout evidence — one dark, tap-friendly ops surface for data centers and
          power plants.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app" className="btn-primary min-w-44">
            Enter Columbiana DC
          </Link>
          <Link href="/app/punches" className="btn-ghost min-w-44">
            Punch list
          </Link>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              k: "01",
              t: "Punch discipline",
              d: "Severity A/B/C, owner, due date, and evidence notes. Closing a punch without proof is not closing it.",
            },
            {
              k: "02",
              t: "ITP as living proof",
              d: "Pass / fail / N/A against the system. The checklist is the backbone of the closeout pack, not a PDF in a trailer.",
            },
            {
              k: "03",
              t: "Export for the owner",
              d: "CSV and print-ready punch lists for the AHJ, the owner Cx, and the 2 a.m. outage window.",
            },
          ].map((item) => (
            <article key={item.k} className="panel p-5">
              <p className="font-mono text-xs text-volt">{item.k}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{item.d}</p>
            </article>
          ))}
        </section>

        <section className="panel mt-10 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-ink-700 p-6 lg:border-b-0 lg:border-r">
              <h2 className="text-xl font-semibold text-white">The problem on the floor</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">
                COD slips when evidence lives in binders, texts, and six spreadsheets. Cx leads cannot see
                which A-punches are open, which systems are actually test-ready, or whether the ITP was
                signed or just promised. DataQuestCX and FQE Power crews already know this. ForgeCX is the
                board they should have been carrying.
              </p>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">What ships in this demo</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-300">
                <li>— Seeded live job: Columbiana DC — Cx Phase</li>
                <li>— 8 systems (UPS, CRAH, MDP, generator, BMS)</li>
                <li>— ~20 punches mixed open / in progress / closed</li>
                <li>— ITP rows with pass, fail, pending, N/A</li>
                <li>— No login. Single-tenant. Built for a 72-hour iteration.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-ink-800 px-6 py-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        ForgeCX · Demo mode · First customer path: DataQuestCX / FQE Power
      </footer>
    </div>
  );
}
