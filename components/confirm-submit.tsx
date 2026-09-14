"use client";

import { useState } from "react";

export function ConfirmSubmit({
  action,
  label,
  confirm,
  className = "btn-danger text-xs",
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  confirm: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <form
      action={async (fd) => {
        if (!window.confirm(confirm)) return;
        setBusy(true);
        await action(fd);
      }}
    >
      {children}
      <button type="submit" className={className} disabled={busy}>
        {busy ? "Working…" : label}
      </button>
    </form>
  );
}
