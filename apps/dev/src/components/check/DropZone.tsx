import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, FileArchive } from "lucide-react";

interface DropZoneProps {
  readonly onFile: (file: File) => void;
  readonly busy: boolean;
}

export function DropZone({ onFile, busy }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        {busy ? "Running checks..." : "Drop your OGraf .zip here"}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {busy ? "This only takes a moment." : "or click anywhere in this box to choose a file"}
      </p>
      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
        <FileArchive className="h-3.5 w-3.5" strokeWidth={2} />
        .zip only · stays in your browser · no upload
      </p>
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
    </label>
  );
}
