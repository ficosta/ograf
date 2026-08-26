/**
 * A confirmation dialog that belongs to the page.
 *
 * This replaces `window.confirm()`. A native confirm is unstyleable, ignores
 * the site's typography entirely, and — because it blocks the renderer — it
 * also freezes anything driving the page, which is how it broke the browser
 * automation used to test the sandbox.
 *
 * Built on <dialog showModal()>, so the browser provides the top layer, the
 * backdrop, focus trapping and Escape handling rather than us reimplementing
 * them badly.
 */

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Escape and the backdrop both close the dialog; treat either as a cancel so
  // the caller's state never disagrees with what is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onCancel();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-dialog-title"
      onClick={(e) => {
        // Clicking the backdrop — the dialog element itself, outside its box.
        if (e.target === ref.current) onCancel();
      }}
      className="max-w-lg rounded-2xl border-0 p-0 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-dialog-title" className="font-display text-lg text-slate-900">
              {title}
            </h2>
            <div className="mt-2 space-y-2 text-sm text-slate-700">{children}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
