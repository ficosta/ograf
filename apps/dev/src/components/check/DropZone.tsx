import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, FileArchive } from "lucide-react";
import { useCopy } from "../../i18n/useLocale";
import { CHECK_COPY } from "../../i18n/copy/check";

interface DropZoneProps {
  readonly onFile: (file: File) => void;
  /** A whole unzipped package folder, for people checking work in progress. */
  readonly onFolder?: (files: readonly File[]) => void;
  readonly busy: boolean;
}

export function DropZone({ onFile, onFolder, busy }: DropZoneProps) {
  const c = useCopy(CHECK_COPY);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const folderRef = useRef<HTMLInputElement | null>(null);

  const accept = useCallback(
    (file: File) => {
      const ok = /\.(zip|ograf|ografpkg)$/i.test(file.name);
      if (!ok) return;
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) accept(file);
    },
    [accept]
  );

  return (
    <label
      htmlFor="check-dropzone"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-slate-400"
      } ${busy ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {busy ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        ) : (
          <Upload className="h-6 w-6" strokeWidth={1.75} />
        )}
      </div>
      <p className="mt-4 font-display text-lg text-slate-900">
        {busy ? c.dropZone.busyTitle : c.dropZone.idleTitle}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {busy ? c.dropZone.busyHint : c.dropZone.idleHint}
      </p>
      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
        <FileArchive className="h-3.5 w-3.5" strokeWidth={2} />
        {c.dropZone.local}
      </p>
      {onFolder && (
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            // The zone is a <label>, so a click here would open the file picker.
            e.preventDefault();
            e.stopPropagation();
            folderRef.current?.click();
          }}
          className="mt-3 text-xs font-medium text-blue-600 underline-offset-2 hover:underline disabled:opacity-50"
        >
          {c.dropZone.folder}
        </button>
      )}
      <input
        id="check-dropzone"
        ref={inputRef}
        type="file"
        accept=".zip"
        disabled={busy}
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          if (f) accept(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
        className="sr-only"
      />
      {onFolder && (
        <input
          ref={folderRef}
          type="file"
          // Non-standard but supported everywhere that matters, including
          // Firefox and Safari — unlike the File System Access API.
          {...{ webkitdirectory: "", directory: "" }}
          multiple
          disabled={busy}
          onChange={(e) => {
            const picked = Array.from(e.currentTarget.files ?? []);
            if (picked.length > 0) onFolder(picked);
            if (folderRef.current) folderRef.current.value = "";
          }}
          className="sr-only"
        />
      )}
    </label>
  );
}
