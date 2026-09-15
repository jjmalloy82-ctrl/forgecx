import fs from "fs";
import path from "path";
import type { EvidenceFile } from "./types";

export const DATA_DIR = path.join(process.cwd(), "data");
export const EVIDENCE_DIR = path.join(DATA_DIR, "evidence");

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 8 * 1024 * 1024;

export function evidencePath(id: string, ext: string): string {
  return path.join(EVIDENCE_DIR, `${id}${ext}`);
}

export function extForMime(mime: string, originalName: string): string {
  const fromName = path.extname(originalName).toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "image/svg+xml") return ".svg";
  return ".bin";
}

export function assertImageFile(mime: string, size: number) {
  if (!ALLOWED.has(mime)) throw new Error("Attach a photo (JPEG, PNG, WebP, GIF, or SVG).");
  if (size > MAX_BYTES) throw new Error("Photo is over 8 MB.");
}

export function writeEvidenceBytes(id: string, mime: string, originalName: string, bytes: Buffer) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const ext = extForMime(mime, originalName);
  const dest = evidencePath(id, ext);
  fs.writeFileSync(dest, bytes);
  return dest;
}

export function readEvidenceFile(row: EvidenceFile): { bytes: Buffer; absPath: string } | null {
  const ext = extForMime(row.mime, row.originalName);
  const absPath = evidencePath(row.id, ext);
  if (!fs.existsSync(absPath)) return null;
  return { bytes: fs.readFileSync(absPath), absPath };
}

export function deleteEvidenceDisk(row: Pick<EvidenceFile, "id" | "mime" | "originalName">) {
  const ext = extForMime(row.mime, row.originalName);
  const absPath = evidencePath(row.id, ext);
  if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
}

export function wipeEvidenceDir() {
  if (!fs.existsSync(EVIDENCE_DIR)) return;
  for (const name of fs.readdirSync(EVIDENCE_DIR)) {
    if (name === ".gitkeep") continue;
    fs.rmSync(path.join(EVIDENCE_DIR, name), { recursive: true, force: true });
  }
}

export function fieldPhotoSvg(caption: string, stamp: string, code: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0a0f18"/>
  <rect x="18" y="18" width="764" height="464" rx="12" fill="#121a26" stroke="#22d3ee" stroke-width="2"/>
  <text x="40" y="64" fill="#22d3ee" font-family="ui-monospace, monospace" font-size="22" font-weight="700">${esc(code)}</text>
  <text x="40" y="100" fill="#8fa3bb" font-family="ui-monospace, monospace" font-size="13" letter-spacing="3">FIELD EVIDENCE</text>
  <rect x="40" y="130" width="720" height="250" rx="8" fill="#0e1520" stroke="#1c2736"/>
  <circle cx="400" cy="240" r="54" fill="none" stroke="#22d3ee" stroke-width="3" opacity="0.45"/>
  <circle cx="400" cy="240" r="18" fill="#22d3ee" opacity="0.35"/>
  <text x="40" y="420" fill="#e8eef6" font-family="system-ui, sans-serif" font-size="20">${esc(caption)}</text>
  <text x="40" y="452" fill="#5b718a" font-family="ui-monospace, monospace" font-size="14">${esc(stamp)}</text>
</svg>
`;
}
