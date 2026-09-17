import { CODE, CODE_AMBER, STRONG } from "../styles";

export const en = {
  title: "Build a countdown timer.",
  intro: (
    <>
      Countdown timers are used everywhere in broadcast — pre-show countdowns, segment timers, auction clocks, and event countdowns. This graphic is unique because it <strong className={STRONG}>ticks itself</strong> using <code className={CODE}>setInterval</code> — no external update calls needed once it starts.
    </>
  ),
  demoTitle: "Countdown — OGraf Template",
  fields: { label: "Label", seconds: "Seconds" },
  differentTitle: "What's different from other graphics?",
  cards: [
    {
      title: "Self-ticking",
      body: (
        <>
          Uses <code className={CODE}>setInterval</code> internally. Once it has played in, it counts down on its own. No <code className={CODE}>updateAction</code> calls from the renderer are needed.
        </>
      ),
    },
    {
      title: "Urgency state",
      body: <>When 10 seconds or fewer remain, the digits turn red and pulse, signalling urgency to the viewer without any operator intervention.</>,
    },
    {
      title: "Clean teardown",
      body: (
        <>
          The interval <strong>must</strong> be cleared in both <code className={CODE}>stopAction()</code> and <code className={CODE}>dispose()</code>. Forgetting either leaves a ghost timer ticking in the background.
        </>
      ),
    },
  ],
  tickTitle: "The ticking engine",
  tickBody: (
    <>
      <code className={CODE}>_startTicking</code> clears any previous interval, then starts a 1-second one. Each tick decrements <code className={CODE}>_remaining</code>, repaints the clock and toggles the <code className={CODE}>urgent</code> class at 10 seconds. When it reaches zero it stops itself, leaving 00:00 on screen. <code className={CODE}>_paintTime</code> only touches the minutes or seconds span whose text actually changed, and <code className={CODE}>_swap</code> restarts that span's <code className={CODE}>tick</code> animation with a forced reflow.
    </>
  ),
  playTitle: "Starting after the entrance",
  playBody: (
    <>
      <code className={CODE}>load</code> paints the starting time from the <code className={CODE}>seconds</code> field; the clock only starts moving on play. <code className={CODE}>playAction</code> follows the spec's step model (<code className={CODE}>goto</code>, else current step plus <code className={CODE}>delta</code>). With <code className={CODE}>stepCount: 1</code>, a second play goes past the last step, so it stops the graphic and returns <code className={CODE}>currentStep: undefined</code>. The interval starts only after the 800 ms entrance, and only if <code className={CODE}>this._rev</code> hasn't moved on: a stop sent during the entrance must not be followed by a clock that starts ticking anyway. <code className={CODE}>updateAction</code> takes partial data; if the clock was running it restarts from the new value.
    </>
  ),
  cleanupTitle: "Cleaning up",
  cleanupBody: (
    <>
      <code className={CODE}>stopAction</code> clears the interval before its 500 ms exit, and <code className={CODE}>dispose</code> clears it again and bumps the revision so nothing pending touches the emptied element.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: (
    <>
      Always clear intervals in <code className={CODE_AMBER}>stopAction()</code> and <code className={CODE_AMBER}>dispose()</code>. In a broadcast environment, graphics are loaded and unloaded frequently. A forgotten interval means a timer ticking in the background, consuming CPU and potentially causing unexpected behaviour when the graphic is reloaded.
    </>
  ),
  cssTitle: "The CSS: tick animation and urgency",
  cssBody: (
    <>
      Each digit pair that changes slides up into place over 0.36 s with the <code className={CODE}>tick</code> class. When urgency kicks in, the time turns red and pulses gently in scale once a second.
    </>
  ),
  manifestTitle: "Countdown Timer",
  doneTitle: "Countdown complete.",
  doneBody: "Self-ticking with setInterval, an urgency state, and proper cleanup in stopAction() and dispose(): a self-contained timer graphic.",
  codeLabels: {
    ticking: "ticking",
    keyParts: "key parts",
  },
  next: "Next: Breaking News",
};

export type CountdownCopy = typeof en;
