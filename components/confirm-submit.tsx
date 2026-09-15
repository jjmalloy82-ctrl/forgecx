"use client";

import { useState } from "react";

export function ConfirmActionButton({
  action,
  fields,
  label,
  confirm,
  className = "btn-danger text-xs",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  label: string;
  confirm: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(confirm)) return;
        setBusy(true);
        const fd = new FormData();
        for (const [k, v] of Object.entries(fields)) fd.set(k, v);
        await action(fd);
        setBusy(false);
      }}
    >
      {busy ? "Working…" : label}
    </button>
  );
}

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
