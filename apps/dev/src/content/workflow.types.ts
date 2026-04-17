/**
 * Types for the animated workflow diagram on the Spec page.
 * Data lives in workflow.json.
 */

export interface WorkflowNode {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Name of a lucide-react icon used to render the node */
  readonly icon: string;
}

export interface Workflow {
  readonly title: string;
  readonly description: string;
  readonly nodes: readonly WorkflowNode[];
}
