import { buildPilotPackHtml } from "@/lib/pilot-pack";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pack = buildPilotPackHtml(id);
  if (!pack) notFound();

  return new Response(pack.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${pack.filename}"`,
    },
  });
}
