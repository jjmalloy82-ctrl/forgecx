"use client";

import { resetDemoData } from "@/lib/actions";
import { useState } from "react";

export function ResetDemoButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn-ghost text-xs"
      disabled={busy}
      onClick={async () => {
        if (!confirm("Reset all data to the demo: Columbiana DC (DataQuestCX) and Nantong Cogen (FQE Power)?")) return;
        setBusy(true);
        await resetDemoData();
      }}
    >
      {busy ? "Resetting…" : "Reset demo data"}
    </button>
  );
}
