import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { DATA_DIR, fieldPhotoSvg, wipeEvidenceDir, writeEvidenceBytes } from "./evidence";
import {
  SEED_EVIDENCE_PHOTOS,
  SEED_IST_COLUMBIANA,
  SEED_ITP,
  SEED_PROJECT,
  SEED_PUNCHES,
  SEED_SYSTEMS,
} from "./seed";
import {
  SEED_IST_NANTONG,
  SEED_NANTONG,
  SEED_NANTONG_ITP,
  SEED_NANTONG_PHOTOS,
  SEED_NANTONG_PUNCHES,
  SEED_NANTONG_SYSTEMS,
} from "./seed-nantong";
import { nowIso } from "./utils";

const DB_PATH = path.join(DATA_DIR, "forgecx.db");

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  site TEXT NOT NULL,
  client TEXT NOT NULL,
  vertical TEXT NOT NULL CHECK (vertical IN ('data_center', 'power_plant')),
  status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'punch_out', 'closed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS systems (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  discipline TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_test', 'punch', 'accepted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS punches (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  system_id TEXT NOT NULL REFERENCES systems(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL CHECK (severity IN ('A', 'B', 'C')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')),
  owner TEXT NOT NULL,
  due_date TEXT,
  evidence_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS itp_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  system_id TEXT NOT NULL REFERENCES systems(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  procedure_ref TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL CHECK (result IN ('pending', 'pass', 'fail', 'na')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ist_gates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('pending', 'pass', 'fail')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_files (
  id TEXT PRIMARY KEY,
  punch_id TEXT NOT NULL REFERENCES punches(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_systems_project ON systems(project_id);
CREATE INDEX IF NOT EXISTS idx_punches_project ON punches(project_id);
CREATE INDEX IF NOT EXISTS idx_punches_system ON punches(system_id);
CREATE INDEX IF NOT EXISTS idx_punches_status ON punches(status);
CREATE INDEX IF NOT EXISTS idx_itp_system ON itp_items(system_id);
CREATE INDEX IF NOT EXISTS idx_ist_project ON ist_gates(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_punch ON evidence_files(punch_id);
`;

type GlobalDb = { conn: Database.Database | null };

const g = globalThis as typeof globalThis & { __forgecxDb?: GlobalDb };

function insertProject(db: Database.Database) {
  return db.prepare(`
    INSERT OR IGNORE INTO projects (id, name, site, client, vertical, status, created_at, updated_at)
    VALUES (@id, @name, @site, @client, @vertical, @status, @createdAt, @updatedAt)
  `);
}

function seedColumbiana(db: Database.Database) {
  const insertSystem = db.prepare(`
    INSERT OR IGNORE INTO systems (id, project_id, name, tag, discipline, status, created_at, updated_at)
    VALUES (@id, @projectId, @name, @tag, @discipline, @status, @createdAt, @updatedAt)
  `);
  const insertPunch = db.prepare(`
    INSERT OR IGNORE INTO punches (
      id, project_id, system_id, number, title, description, severity, status,
      owner, due_date, evidence_notes, created_at, updated_at, closed_at
    ) VALUES (
      @id, @projectId, @systemId, @number, @title, @description, @severity, @status,
      @owner, @dueDate, @evidenceNotes, @createdAt, @updatedAt, @closedAt
    )
  `);
  const insertItp = db.prepare(`
    INSERT OR IGNORE INTO itp_items (
      id, project_id, system_id, step_number, title, procedure_ref, result, notes, created_at, updated_at
    ) VALUES (
      @id, @projectId, @systemId, @stepNumber, @title, @procedureRef, @result, @notes, @createdAt, @updatedAt
    )
  `);
  const insertIst = db.prepare(`
    INSERT OR IGNORE INTO ist_gates (
      id, project_id, step_number, title, result, notes, created_at, updated_at
    ) VALUES (
      @id, @projectId, @stepNumber, @title, @result, @notes, @createdAt, @updatedAt
    )
  `);

  insertProject(db).run(SEED_PROJECT);
  for (const s of SEED_SYSTEMS) insertSystem.run(s);
  for (const p of SEED_PUNCHES) insertPunch.run(p);
  for (const i of SEED_ITP) insertItp.run(i);
  for (const g of SEED_IST_COLUMBIANA) insertIst.run(g);
}

function seedNantong(db: Database.Database) {
  const insertSystem = db.prepare(`
    INSERT OR IGNORE INTO systems (id, project_id, name, tag, discipline, status, created_at, updated_at)
    VALUES (@id, @projectId, @name, @tag, @discipline, @status, @createdAt, @updatedAt)
  `);
  const insertPunch = db.prepare(`
    INSERT OR IGNORE INTO punches (
      id, project_id, system_id, number, title, description, severity, status,
      owner, due_date, evidence_notes, created_at, updated_at, closed_at
    ) VALUES (
      @id, @projectId, @systemId, @number, @title, @description, @severity, @status,
      @owner, @dueDate, @evidenceNotes, @createdAt, @updatedAt, @closedAt
    )
  `);
  const insertItp = db.prepare(`
    INSERT OR IGNORE INTO itp_items (
      id, project_id, system_id, step_number, title, procedure_ref, result, notes, created_at, updated_at
    ) VALUES (
      @id, @projectId, @systemId, @stepNumber, @title, @procedureRef, @result, @notes, @createdAt, @updatedAt
    )
  `);
  const insertIst = db.prepare(`
    INSERT OR IGNORE INTO ist_gates (
      id, project_id, step_number, title, result, notes, created_at, updated_at
    ) VALUES (
      @id, @projectId, @stepNumber, @title, @result, @notes, @createdAt, @updatedAt
    )
  `);

  insertProject(db).run(SEED_NANTONG);
  for (const s of SEED_NANTONG_SYSTEMS) insertSystem.run(s);
  for (const p of SEED_NANTONG_PUNCHES) insertPunch.run(p);
  for (const i of SEED_NANTONG_ITP) insertItp.run(i);
  for (const g of SEED_IST_NANTONG) insertIst.run(g);
}

function seedEvidencePhotos(db: Database.Database) {
  const insertEv = db.prepare(`
    INSERT OR IGNORE INTO evidence_files (id, punch_id, original_name, mime, size_bytes, created_at)
    VALUES (@id, @punchId, @originalName, @mime, @sizeBytes, @createdAt)
  `);
  const photos = [...SEED_EVIDENCE_PHOTOS, ...SEED_NANTONG_PHOTOS];
  for (const photo of photos) {
    const punch = db.prepare("SELECT id FROM punches WHERE id = ?").get(photo.punchId) as { id: string } | undefined;
    if (!punch) continue;
    const svg = fieldPhotoSvg(photo.caption, photo.stamp, photo.originalName.replace(/\..+$/, ""));
    const bytes = Buffer.from(svg, "utf8");
    writeEvidenceBytes(photo.id, "image/svg+xml", photo.originalName, bytes);
    insertEv.run({
      id: photo.id,
      punchId: photo.punchId,
      originalName: photo.originalName,
      mime: "image/svg+xml",
      sizeBytes: bytes.length,
      createdAt: nowIso(),
    });
  }
}

function seedAll(db: Database.Database) {
  const tx = db.transaction(() => {
    seedColumbiana(db);
    seedNantong(db);
  });
  tx();
  seedEvidencePhotos(db);
}

function ensureUpgradeSeed(db: Database.Database) {
  const nantong = db.prepare("SELECT id FROM projects WHERE id = ?").get(SEED_NANTONG.id);
  if (!nantong) seedNantong(db);

  const istCol = db.prepare("SELECT COUNT(*) AS c FROM ist_gates WHERE project_id = ?").get(SEED_PROJECT.id) as {
    c: number;
  };
  if (istCol.c === 0) {
    const insertIst = db.prepare(`
      INSERT OR IGNORE INTO ist_gates (
        id, project_id, step_number, title, result, notes, created_at, updated_at
      ) VALUES (
        @id, @projectId, @stepNumber, @title, @result, @notes, @createdAt, @updatedAt
      )
    `);
    for (const g of SEED_IST_COLUMBIANA) insertIst.run(g);
  }

  const ev = db.prepare("SELECT COUNT(*) AS c FROM evidence_files").get() as { c: number };
  if (ev.c === 0) seedEvidencePhotos(db);
}

export function getDb(): Database.Database {
  if (!g.__forgecxDb) g.__forgecxDb = { conn: null };
  if (g.__forgecxDb.conn) return g.__forgecxDb.conn;

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const firstRun = !fs.existsSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  const n = db.prepare("SELECT COUNT(*) AS c FROM projects").get() as { c: number };
  if (firstRun || n.c === 0) {
    seedAll(db);
  } else {
    ensureUpgradeSeed(db);
  }

  g.__forgecxDb.conn = db;
  return db;
}

export function resetDatabase() {
  if (g.__forgecxDb?.conn) {
    g.__forgecxDb.conn.close();
    g.__forgecxDb.conn = null;
  }
  for (const suffix of ["", "-wal", "-shm"]) {
    const p = `${DB_PATH}${suffix}`;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  wipeEvidenceDir();
  return getDb();
}
