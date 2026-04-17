/**
 * Types for the role-based onboarding cards shown on the homepage.
 * Data lives in roles.json.
 */

export type RoleAccent = "blue" | "cyan" | "emerald";

export interface Role {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  /** Name of a lucide-react icon used to render the card */
  readonly icon: string;
  readonly cta: string;
  readonly ctaLink: string;
  readonly accent: RoleAccent;
}
