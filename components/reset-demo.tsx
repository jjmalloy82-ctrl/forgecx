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
        if (!confirm("Reset all data back to the Columbiana DC seed job?")) return;
        setBusy(true);
        await resetDemoData();
      }}
    >
      {busy ? "Resetting…" : "Reset demo data"}
    </button>
  );
}
