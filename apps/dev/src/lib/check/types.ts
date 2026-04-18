export type Severity = "error" | "warning" | "info" | "pass";

export type Category = "manifest" | "structure" | "module" | "styling" | "assets" | "runtime";

export interface Finding {
  readonly id: string;
  readonly category: Category;
  readonly severity: Severity;
  readonly title: string;
  readonly message: string;
  readonly path?: string;
  readonly excerpt?: string;
  readonly specRef?: string;
}

export interface Pkg {
  readonly zipName: string;
  readonly zipSize: number;
  readonly rootFolder: string;
  readonly files: ReadonlyMap<string, Uint8Array>;
  readonly texts: ReadonlyMap<string, string>;
  readonly manifestPath: string | null;
  readonly manifestRaw: string | null;
  readonly manifest: unknown;
  readonly mainPath: string | null;
  readonly hasHiddenFiles: boolean;
}

export interface SchemaSource {
  readonly kind: "live" | "bundled";
  readonly url: string;
  readonly fetchedAt: string;
  readonly note?: string;
}

export interface Report {
  readonly pkgName: string;
  readonly pkgSize: number;
  readonly findings: readonly Finding[];
  readonly durationMs: number;
  readonly schemaSource: SchemaSource;
  readonly summary: {
    readonly errors: number;
    readonly warnings: number;
    readonly infos: number;
    readonly passes: number;
  };
}

export const CATEGORY_LABEL: Readonly<Record<Category, string>> = {
  manifest: "Manifest",
  structure: "Package structure",
  module: "Graphic module",
  styling: "Styling",
  assets: "Assets",
  runtime: "Runtime",
};

export const CATEGORY_ORDER: readonly Category[] = [
  "manifest",
  "structure",
  "module",
  "styling",
  "assets",
  "runtime",
];
