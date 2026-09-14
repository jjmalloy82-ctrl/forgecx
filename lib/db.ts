import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { SEED_ITP, SEED_PROJECT, SEED_PUNCHES, SEED_SYSTEMS } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
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

CREATE INDEX IF NOT EXISTS idx_systems_project ON systems(project_id);
CREATE INDEX IF NOT EXISTS idx_punches_project ON punches(project_id);
CREATE INDEX IF NOT EXISTS idx_punches_system ON punches(system_id);
CREATE INDEX IF NOT EXISTS idx_punches_status ON punches(status);
CREATE INDEX IF NOT EXISTS idx_itp_system ON itp_items(system_id);
`;

type GlobalDb = { conn: Database.Database | null };

const g = globalThis as typeof globalThis & { __forgecxDb?: GlobalDb };

function seed(db: Database.Database) {
  const insertProject = db.prepare(`
    INSERT INTO projects (id, name, site, client, vertical, status, created_at, updated_at)
    VALUES (@id, @name, @site, @client, @vertical, @status, @createdAt, @updatedAt)
  `);
  const insertSystem = db.prepare(`
    INSERT INTO systems (id, project_id, name, tag, discipline, status, created_at, updated_at)
    VALUES (@id, @projectId, @name, @tag, @discipline, @status, @createdAt, @updatedAt)
  `);
  const insertPunch = db.prepare(`
    INSERT INTO punches (
      id, project_id, system_id, number, title, description, severity, status,
      owner, due_date, evidence_notes, created_at, updated_at, closed_at
    ) VALUES (
      @id, @projectId, @systemId, @number, @title, @description, @severity, @status,
      @owner, @dueDate, @evidenceNotes, @createdAt, @updatedAt, @closedAt
    )
  `);
  const insertItp = db.prepare(`
    INSERT INTO itp_items (
      id, project_id, system_id, step_number, title, procedure_ref, result, notes, created_at, updated_at
    ) VALUES (
      @id, @projectId, @systemId, @stepNumber, @title, @procedureRef, @result, @notes, @createdAt, @updatedAt
    )
  `);

  const tx = db.transaction(() => {
    insertProject.run(SEED_PROJECT);
    for (const s of SEED_SYSTEMS) insertSystem.run(s);
    for (const p of SEED_PUNCHES) insertPunch.run(p);
    for (const i of SEED_ITP) insertItp.run(i);
  });
  tx();
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
    seed(db);
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
  return getDb();
}
