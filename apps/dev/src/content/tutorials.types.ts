/**
 * Shared types for tutorial content loaded from tutorials.json.
 * This is the single source of truth for tutorial metadata.
 */

export type TutorialDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TutorialFieldText {
  readonly key: string;
  readonly label: string;
  readonly type?: "text";
  readonly defaultValue: string;
}

export interface TutorialFieldList {
  readonly key: string;
  readonly label: string;
  readonly type: "list";
  readonly defaultValue: readonly string[];
}

export interface TutorialFieldJson {
  readonly key: string;
  readonly label: string;
  readonly type: "json";
  readonly defaultValue: unknown;
}

export type TutorialField =
  | TutorialFieldText
  | TutorialFieldList
  | TutorialFieldJson;

export interface TutorialDemoConfig {
  readonly src: string;
  readonly fields: readonly TutorialField[];
  readonly defaultData?: Readonly<Record<string, unknown>>;
}

export interface Tutorial {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly difficulty: TutorialDifficulty;
  readonly time: string;
  readonly desc: string;
  readonly preview: string;
  readonly demo: TutorialDemoConfig;
  readonly concepts: readonly string[];
}
