/**
 * Types for the FAQ entries shown on the homepage.
 * Data lives in faq.json.
 */

export interface FaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}
