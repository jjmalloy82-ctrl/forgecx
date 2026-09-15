import { getEvidence } from "@/lib/queries";
import { readEvidenceFile } from "@/lib/evidence";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getEvidence(id);
  if (!row) notFound();
  const disk = readEvidenceFile(row);
  if (!disk) notFound();

  return new Response(new Uint8Array(disk.bytes), {
    headers: {
      "Content-Type": row.mime,
      "Content-Disposition": `inline; filename="${row.originalName.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
