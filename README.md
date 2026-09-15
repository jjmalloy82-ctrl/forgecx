# ForgeCX

AI-native commissioning ops for data centers and power plants.

**Close the plant. Keep the proof.**

ForgeCX is a field board for commissioning leads: punches, ITP / test checklists, IST / energization gates, and closeout evidence (notes + photos) in one dark, tap-friendly ops surface. First customer path is DataQuestCX / FQE Power.

This repo ships a **single-tenant demo** (no login). Opening the app loads two live-feeling jobs: Columbiana DC and Nantong Cogen.

## Run

```bash
npm install && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Marketing site is `/`. The job board is `/app`.

SQLite is created on first run at `data/forgecx.db` and seeded automatically. Photo evidence lives under `data/evidence/`.

```bash
npm run build && npm start   # production
```

## What you can do

- Browse **two seed jobs**: Columbiana DC (data center) and Nantong Cogen (power plant)
- Create / rename / delete **projects** and **systems** (deletes confirm first)
- Raise a **punch** (severity A/B/C), mark in progress, **close with evidence notes**
- Attach **photos** to a punch; thumbnails on the punch detail
- Filter the punch board and **export CSV** (filters apply)
- Edit **ITP** rows (pass / fail / N/A / pending + notes)
- Drive the **IST / energization gate** board per project (LOTO, relays, sync checks, trips)
- One-click **Pilot pack**: downloadable HTML of open A/B punches + ITP summary + IST gates (photos inlined)
- Print-friendly punch list at `/app/punches/print`
- **Reset demo data** from the sidebar (restores **both** seed jobs and demo photos)

## Stack

Next.js App Router · TypeScript · Tailwind CSS · SQLite (`better-sqlite3`) · Server Actions

No auth. Demo mode only. Ready for the next 72-hour iteration (multi-tenant auth, IST scheduling, vendor portal).

## Day 1 company brief

**Product.** ForgeCX is commissioning operations software, not a generic CMMS and not a document vault. The unit of work is the *job*: systems under test, punches that block COD / first sync, the ITP that proves the plant, and the IST gate that says “you may energize.”

**Who.** Cx engineers, discipline leads, and vendor techs on data center and power plant turnovers. First design partners: DataQuestCX / FQE Power.

**Why now.** Closeout still lives in binders, group texts, and six spreadsheets. A-punches hide until the AHJ walk. Evidence is a photo on someone’s phone. ForgeCX makes the board the source of truth.

**MVP bet.** If a Cx lead can add a punch on the floor, close it with notes and a photo, filter the open A-list, see the IST gate, and export a pilot pack — the product is real. AI (auto-classify severity, draft ITP from spec, IST readiness) comes after the board is trusted.

**Brand.** Dark industrial UI (slate + electric cyan). Wordmark ForgeCX. Tagline as above. Mission-control, not consumer candy.

**Out of scope for this cut.** Auth, multi-tenant orgs, offline native, integrations with Procore / BIM 360.

## Demo seeds

### Columbiana DC — Cx Phase

| | |
| --- | --- |
| Client | DataQuestCX |
| Site | Columbiana, OH · Hall A / 30 MW |
| Vertical | Data center |
| Systems | UPS-A/B, CRAH-01..03, Switchgear-MDP, Generator-1, BMS |
| Punches | ~20 mixed open / in progress / closed |
| IST | LOTO, relays, arc-flash, UPS bypass, ATS, EPO, NOC alarms, IST script |
| Photos | Seeded closeout SVGs on closed punches |

### Nantong Cogen — Cx Phase

| | |
| --- | --- |
| Client | FQE Power |
| Site | Nantong, Jiangsu · 2× F-class GT + HRSG + STG |
| Vertical | Power plant |
| Systems | GT-1, HRSG-1, STG-1, SWGR-13kV, CW-1, DCS |
| Punches | ~12 (overspeed, drum level, sync-check, islanding, LOTO…) |
| IST | LOTO, relays, sync checks, overspeed, safety valves, fuel-gas ESD, islanding, grid interconnect |

Use **Reset demo data** any time the board gets messy — it reseeds **both** jobs.
