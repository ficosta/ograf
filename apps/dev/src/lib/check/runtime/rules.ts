import type { Finding } from "../types";
import type { RuntimeCall, RuntimeError, RuntimeSession } from "./types";

interface ReturnShape {
  readonly isObject: boolean;
  readonly statusCode?: number;
  readonly currentStep?: unknown;
  readonly extraKeys: readonly string[];
}

const SPEC_LIFECYCLE = "https://ograf.ebu.io/#lifecycle";
const SPEC_PLAY_ACTION = "https://ograf.ebu.io/v1/specification/docs/Specification.html#playaction";

/** Label of the smoke-run call that plays one step past the last one (R-15). */
export const PLAY_TO_END_LABEL = "playAction({}) past the last step";

/**
 * Turns a live RuntimeSession into a list of R-* findings added to the
 * main report. Called both mid-run (for live updates) and at the end
 * of the smoke sequence.
 */
export function buildRuntimeFindings(
  session: RuntimeSession,
  manifest: unknown
): readonly Finding[] {
  const findings: Finding[] = [];
  const declaresNonRealTime =
    typeof manifest === "object" &&
    manifest !== null &&
    (manifest as { supportsNonRealTime?: unknown }).supportsNonRealTime === true;

  if (session.status === "failed") {
    findings.push({
      id: "R-01",
      category: "runtime",
      severity: "error",
      title: "Module did not import",
      message:
        session.failureReason ??
        "The sandboxed iframe could not import graphic.mjs. See the console capture for details.",
    });
    return findings;
  }

  if (session.status === "idle" || session.status === "ready") {
    // Sandbox opened but user has not driven any lifecycle calls yet.
    return findings;
  }

  // Find each lifecycle call from the timeline.
  const byAction = new Map<string, RuntimeCall[]>();
  for (const c of session.calls) {
    const arr = byAction.get(c.action) ?? [];
    arr.push(c);
    byAction.set(c.action, arr);
  }

  const stepCount = extractStepCount(manifest);
  // The first play from the start state is the one whose step is predictable:
  // step 0, or undefined for a zero-step graphic. Later plays depend on what
  // ran before them, so R-03 judges only the first.
  const plays = byAction.get("playAction")?.filter((c) => c.label !== PLAY_TO_END_LABEL);
  addLifecycleFinding(findings, byAction.get("load"), "R-02", "load");
  addLifecycleFinding(findings, plays?.slice(0, 1), "R-03", "playAction", {
    expectCurrentStep: stepCount === 0 ? "undefined" : "number",
  });
  addLifecycleFinding(findings, byAction.get("updateAction"), "R-04", "updateAction");
  addLifecycleFinding(findings, byAction.get("stopAction"), "R-05", "stopAction");
  addLifecycleFinding(findings, byAction.get("dispose"), "R-07", "dispose");

  // R-15: the step model. "When the target step is higher or equal to the
  // stepCount … the Graphic MUST transition to the end", and the reply's
  // currentStep MUST be undefined. A graphic that ignores goto/delta keeps
  // replaying step 0 and a controller's "next" never takes it off air.
  const toEnd = session.calls.find((c) => c.label === PLAY_TO_END_LABEL);
  if (toEnd && !toEnd.error) {
    const shape = describeReturn(toEnd.result);
    const reachedEnd = shape.isObject && shape.currentStep === undefined;
    findings.push({
      id: "R-15",
      category: "runtime",
      severity: reachedEnd ? "pass" : "error",
      title: reachedEnd
        ? "Playing past the last step goes to the end"
        : "Playing past the last step does not go to the end",
      message: reachedEnd
        ? `After ${stepCount} step${stepCount === 1 ? "" : "s"}, one more playAction({}) returned currentStep undefined.`
        : `After ${stepCount} step${stepCount === 1 ? "" : "s"}, one more playAction({}) must take the graphic to the end and return currentStep: undefined. Got ${formatReturn(toEnd)}. Work out the target step from goto/delta as the spec describes.`,
      specRef: SPEC_PLAY_ACTION,
    });
  }

  // R-13 / R-14: the non-real-time pair, asserted only when the manifest says
  // the graphic supports it — a real-time-only graphic is right not to have them.
  if (declaresNonRealTime) {
    addLifecycleFinding(findings, byAction.get("setActionsSchedule"), "R-13", "setActionsSchedule");
    addLifecycleFinding(findings, byAction.get("goToTime"), "R-14", "goToTime");
  }

  // R-06: an id the manifest does not declare. The spec only obliges the
  // renderer to send declared ids, so failing loudly is good practice rather
  // than a requirement — the EBU's l3rd-name example resolves undefined here.
  const customUnknown = session.calls.find(
    (c) =>
      c.action === "customAction" &&
      c.payloadPreview?.includes("__ograf_unknown__") === true,
  );
  if (customUnknown) {
    const shape = describeReturn(customUnknown.result);
    const reasonableFallback =
      !customUnknown.error && shape.isObject && shape.statusCode !== undefined && shape.statusCode >= 400;
    findings.push({
      id: "R-06",
      category: "runtime",
      severity: reasonableFallback ? "pass" : "info",
      title: reasonableFallback
        ? "Unknown customAction returns a non-success statusCode"
        : "Unknown customAction reports success",
      message: reasonableFallback
        ? `Called customAction with "__ograf_unknown__"; graphic returned statusCode ${shape.statusCode}. Good — the fallback path works.`
        : `Optional. Answering an id the manifest does not declare with a 4xx (400 or 404 are typical) makes a controller's typo visible instead of silently doing nothing. Got ${formatReturn(customUnknown)}.`,
      specRef: SPEC_LIFECYCLE,
    });
  }

  // R-08 / R-09: uncaught errors during the run.
  const windowErrors = session.errors.filter((e) => e.source === "window");
  const rejections = session.errors.filter((e) => e.source === "promise");
  if (windowErrors.length > 0) {
    findings.push({
      id: "R-08",
      category: "runtime",
      severity: "error",
      title: `Uncaught error${windowErrors.length > 1 ? "s" : ""} during the run`,
      message: windowErrors.map(formatError).join("\n"),
    });
  }
  if (rejections.length > 0) {
    findings.push({
      id: "R-09",
      category: "runtime",
      severity: "error",
      title: `Unhandled promise rejection${rejections.length > 1 ? "s" : ""} during the run`,
      message: rejections.map(formatError).join("\n"),
    });
  }

  // R-10: per-call timing as compact info rows.
  for (const call of session.calls) {
    findings.push({
      id: "R-10",
      category: "runtime",
      severity: call.error ? "error" : "info",
      title: call.error
        ? `${call.label} threw after ${call.durationMs.toFixed(0)} ms`
        : `${call.label} returned in ${call.durationMs.toFixed(0)} ms`,
      message: call.error
        ? call.error
        : `Return: ${formatReturn(call)}`,
    });
  }

  // R-11: timing sanity.
  const expectations: Record<string, number> = {
    load: 3000,
    playAction: 5000,
    updateAction: 2000,
    stopAction: 2000,
    dispose: 500,
    customAction: 5000,
  };
  for (const call of session.calls) {
    const budget = expectations[call.action];
    if (budget && call.durationMs > budget) {
      findings.push({
        id: "R-11",
        category: "runtime",
        severity: "warning",
        title: `${call.label} took longer than ${budget} ms`,
        message: `${call.durationMs.toFixed(0)} ms. Long lifecycle responses can starve the renderer or block automation workflows.`,
      });
    }
  }

  // R-12: each declared customAction should return a success statusCode.
  const declaredActions = extractDeclaredActions(manifest);
  for (const action of declaredActions) {
    const hits = session.calls.filter(
      (c) => c.action === "customAction" && c.payloadPreview?.includes(`"${action}"`),
    );
    if (hits.length === 0) continue;
    const last = hits[hits.length - 1];
    const shape = describeReturn(last.result);
    const ok =
      !last.error &&
      (last.result === undefined ||
        (shape.isObject && typeof shape.statusCode === "number" && shape.statusCode >= 200 && shape.statusCode < 300));
    findings.push({
      id: "R-12",
      category: "runtime",
      severity: ok ? "pass" : "error",
      title: ok
        ? `customAction "${action}" succeeded`
        : `customAction "${action}" did not return a success statusCode`,
      message: ok
        ? `Return: ${formatReturn(last)} (in ${last.durationMs.toFixed(0)} ms).`
        : `Expected statusCode 2xx. Got ${formatReturn(last)}.`,
      specRef: SPEC_LIFECYCLE,
    });
  }

  return findings;
}

function addLifecycleFinding(
  findings: Finding[],
  calls: readonly RuntimeCall[] | undefined,
  id: string,
  label: string,
  opts: { expectCurrentStep?: "number" | "undefined" } = {}
): void {
  if (!calls || calls.length === 0) {
    findings.push({
      id,
      category: "runtime",
      severity: "info",
      title: `${label} not invoked in this run`,
      message: "Skipped by the smoke sequence; run it manually to see results.",
    });
    return;
  }
  const last = calls[calls.length - 1];
  if (last.error) {
    findings.push({
      id,
      category: "runtime",
      severity: "error",
      title: `${label}() threw`,
      message: last.error,
    });
    return;
  }
  // "If the returned Promise resolves to undefined, it MUST be treated as a
  // { statusCode: 200 }." playAction is the exception: it has to report
  // currentStep, so it always resolves to an object.
  const mayBeUndefined = opts.expectCurrentStep === undefined;
  if (last.result === undefined && mayBeUndefined) {
    findings.push({
      id,
      category: "runtime",
      severity: "pass",
      title: `${label}() resolved (undefined counts as success)`,
      message: `Resolved to undefined, which the spec treats as { statusCode: 200 }. Completed in ${last.durationMs.toFixed(0)} ms.`,
    });
    return;
  }
  const shape = describeReturn(last.result);
  if (!shape.isObject || shape.statusCode === undefined) {
    findings.push({
      id,
      category: "runtime",
      severity: "error",
      title: `${label}() did not return a { statusCode } object`,
      message: `Got ${JSON.stringify(last.result) ?? "undefined"}. Each lifecycle method must resolve to an object with at least a numeric \`statusCode\`.`,
      specRef: SPEC_LIFECYCLE,
    });
    return;
  }
  if (shape.statusCode < 200 || shape.statusCode >= 300) {
    findings.push({
      id,
      category: "runtime",
      severity: "error",
      title: `${label}() returned a non-success statusCode`,
      message: `statusCode ${shape.statusCode}. Expected 200–299 for a successful call.`,
    });
    return;
  }
  if (opts.expectCurrentStep === "number" && typeof shape.currentStep !== "number") {
    findings.push({
      id,
      category: "runtime",
      severity: "warning",
      title: `${label}() did not return \`currentStep: number\``,
      message: `The first playAction from the start lands on step 0, so it should return { statusCode, currentStep: 0 }. Got currentStep: ${JSON.stringify(shape.currentStep)}.`,
      specRef: SPEC_PLAY_ACTION,
    });
    return;
  }
  if (opts.expectCurrentStep === "undefined" && shape.currentStep !== undefined) {
    findings.push({
      id,
      category: "runtime",
      severity: "warning",
      title: `${label}() returned a currentStep for a zero-step graphic`,
      message: `The manifest declares stepCount: 0, and "in case stepCount is equal to zero … the currentStep field in the response MUST be undefined". Got currentStep: ${JSON.stringify(shape.currentStep)}.`,
      specRef: SPEC_PLAY_ACTION,
    });
    return;
  }
  findings.push({
    id,
    category: "runtime",
    severity: "pass",
    title: `${label}() returned a success statusCode`,
    message: `statusCode ${shape.statusCode}${typeof shape.currentStep === "number" ? `, currentStep ${shape.currentStep}` : ""}. Completed in ${last.durationMs.toFixed(0)} ms.`,
  });
}

function describeReturn(result: unknown): ReturnShape {
  if (result == null || typeof result !== "object") {
    return { isObject: false, extraKeys: [] };
  }
  const r = result as Record<string, unknown>;
  const keys = Object.keys(r);
  const reserved = new Set(["statusCode", "statusMessage", "currentStep"]);
  const extra = keys.filter((k) => !reserved.has(k) && !k.startsWith("v_"));
  return {
    isObject: true,
    statusCode: typeof r.statusCode === "number" ? (r.statusCode as number) : undefined,
    currentStep: r.currentStep,
    extraKeys: extra,
  };
}

function formatReturn(call: RuntimeCall): string {
  if (call.error) return `threw: ${call.error}`;
  try {
    return JSON.stringify(call.result);
  } catch {
    return String(call.result);
  }
}

function formatError(e: RuntimeError): string {
  return e.stack ?? e.message;
}

/** Manifest stepCount; absent means 1, per the spec. */
export function extractStepCount(manifest: unknown): number {
  if (!manifest || typeof manifest !== "object") return 1;
  const value = (manifest as { stepCount?: unknown }).stepCount;
  return typeof value === "number" && Number.isInteger(value) ? value : 1;
}

function extractDeclaredActions(manifest: unknown): readonly string[] {
  if (!manifest || typeof manifest !== "object") return [];
  const m = manifest as { customActions?: unknown };
  if (!Array.isArray(m.customActions)) return [];
  const out: string[] = [];
  for (const entry of m.customActions) {
    if (entry && typeof entry === "object") {
      const id = (entry as { id?: unknown }).id;
      if (typeof id === "string") out.push(id);
    }
  }
  return out;
}
