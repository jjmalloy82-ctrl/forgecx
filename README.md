# ForgeCX

AI-native commissioning ops for data centers and power plants.

**Close the plant. Keep the proof.**

ForgeCX is a field board for commissioning leads: punches, ITP / test checklists, and closeout evidence in one dark, tap-friendly ops surface. First customer path is DataQuestCX / FQE Power.

This repo ships a **single-tenant demo** (no login). Opening the app loads a live-feeling job: Columbiana DC — Cx Phase.

## Run

```bash
npm install && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Marketing site is `/`. The job board is `/app`.

SQLite is created on first run at `data/forgecx.db` and seeded automatically.

```bash
npm run build && npm start   # production
```

## What you can do

- Browse the **Columbiana DC** seed: 8 systems, ~20 punches, a dozen+ ITP rows
- Create / rename / delete **projects** and **systems**
- Raise a **punch** (severity A/B/C), mark in progress, **close with evidence notes**
- Filter the punch board and **export CSV** (filters apply)
- Edit **ITP** rows (pass / fail / N/A / pending + notes)
- Print-friendly punch list at `/app/punches/print`
- **Reset demo data** from the sidebar (restores the seed job)

## Stack

Next.js App Router · TypeScript · Tailwind CSS · SQLite (`better-sqlite3`) · Server Actions

No auth. Demo mode only. Ready for a 72-hour build-race iteration (multi-tenant auth, photo evidence, IST gates).

## Day 1 company brief

**Product.** ForgeCX is commissioning operations software, not a generic CMMS and not a document vault. The unit of work is the *job*: systems under test, punches that block COD, and the ITP that proves the plant.

**Who.** Cx engineers, discipline leads, and vendor techs on data center and power plant turnovers. First design partner: DataQuestCX / FQE Power.

**Why now.** Closeout still lives in binders, group texts, and six spreadsheets. A-punches hide until the AHJ walk. Evidence is a photo on someone’s phone. ForgeCX makes the board the source of truth.

**MVP bet.** If a Cx lead can add a punch on the floor, close it with evidence, filter the open A-list, and export CSV for the owner — the product is real. AI (auto-classify severity, draft ITP from spec, IST readiness) comes after the board is trusted.

**Brand.** Dark industrial UI (slate + electric cyan). Wordmark ForgeCX. Tagline as above. Mission-control, not consumer candy.

**Out of scope for this cut.** Auth, multi-tenant orgs, file uploads, offline native, integrations with Procore / BIM 360.

## Demo seed (Columbiana DC — Cx Phase)

| | |
| --- | --- |
| Client | DataQuestCX |
| Site | Columbiana, OH · Hall A / 30 MW |
| Vertical | Data center |
| Systems | UPS-A/B, CRAH-01..03, Switchgear-MDP, Generator-1, BMS |
| Punches | Mixed open / in progress / closed, A/B/C, owners, due dates, evidence on closed items |
| ITP | Load bank, TAB/FPT, torque, secondary injection, ATS sequence, point-to-point, IST gate |

Use **Reset demo data** any time the board gets messy.
