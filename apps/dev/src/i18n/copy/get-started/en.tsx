import { CODE_AMBER, CODE_BLUE, CODE_ID, CODE_SLATE_LIGHT, STRONG } from "../tutorial-ui/styles";

export const en = {
  title: "Build your first OGraf template.",
  lead: "In this tutorial you'll build a production-quality lower third graphic from scratch — the same kind you see on CBS, BBC, or any news broadcast. It slides in, displays a name and title, updates live, and slides out.",
  demo: {
    name: "Name",
    title: "Title",
    heading: "Lower Third — OGraf Template",
  },
  prereqTitle: "Before you start",
  prereqs: [
    "Basic knowledge of HTML and CSS (JavaScript helps but isn't required to follow along)",
    "A text editor — VS Code, Sublime Text, or anything you're comfortable with",
    "A web browser (Chrome, Firefox, Edge, Safari)",
  ],
  step1: {
    title: "Create your project folder",
    body: "Create a new folder with these four files. That's your entire OGraf package — no build tools, no npm, no framework.",
    notes: { manifest: "manifest", logic: "logic", design: "design", preview: "preview (optional)" },
    callout: (
      <>
        <strong className="text-blue-900">That's it.</strong> Four files. No <code className={CODE_BLUE}>node_modules</code>, no <code className={CODE_BLUE}>package.json</code>, no build step. OGraf packages are plain web files.
      </>
    ),
  },
  step2: {
    title: "Write the manifest — your graphic's ID card",
    body: (
      <>
        The manifest tells every OGraf system who your graphic is and what it needs. When an operator loads your graphic in SPX or any controller, <strong className={STRONG}>this file is the first thing it reads</strong>. It auto-generates the data form you saw in the demo above.
      </>
    ),
    cards: [
      { label: "Identity", body: <><code className={CODE_ID}>id</code> and <code className={CODE_ID}>name</code> — how controllers identify and display your graphic.</> },
      { label: "Behavior", body: <><code className={CODE_ID}>stepCount: 1</code> — one step: it appears, holds, then disappears when stopped.</> },
      { label: "Entry Point", body: <><code className={CODE_ID}>main</code> — points to your JavaScript file with the Web Component class.</> },
      { label: "Data Schema", body: <><code className={CODE_ID}>schema</code> — defines the form fields. Controllers auto-generate the input UI from this.</> },
    ],
  },
  step3: {
    title: "Assemble the package folder",
    body: (
      <>
        An OGraf package is a small folder with a manifest, a JavaScript module, a stylesheet, and any static assets the graphic needs. There is no HTML entry point — the renderer mounts the default-exported class under its own tag, so the module just has to export a class that extends <code className={CODE_SLATE_LIGHT}>HTMLElement</code>.
      </>
    ),
    language: "Text",
    note: (
      <>
        The <code className={CODE_SLATE_LIGHT}>fonts/</code> folder ships the Inter weights this graphic uses along with their license (SIL OFL) — playout boxes are often offline, so bundling fonts avoids CDN calls that would silently fail.
      </>
    ),
  },
  step4: {
    title: "Design the look — CSS",
    body: (
      <>
        This is where the visual design lives. We're building a CBS-inspired clean look: white background, blue accent bar on the left, uppercase blue title. The slide-in uses CSS transitions with <strong className={STRONG}>cubic-bezier easing</strong> for that broadcast-quality feel.
      </>
    ),
    tipTitle: "Design tip",
    tip: (
      <>
        The <code className={CODE_AMBER}>cubic-bezier(0.16, 1, 0.3, 1)</code> easing is key — it starts fast and decelerates smoothly, giving that snappy broadcast motion feel. The out-animation uses <code className={CODE_AMBER}>cubic-bezier(0.76, 0, 0.24, 1)</code> for a quick, punchy exit.
      </>
    ),
  },
  step5: {
    title: "Write the logic — the Web Component",
    body: (
      <>
        This is the heart of your OGraf graphic. It's a standard Web Component that the renderer controls by calling six methods — five linear lifecycle steps plus <code className={CODE_SLATE_LIGHT}>customAction</code> for graphic-specific extras. Each returns a Promise: <strong className={STRONG}>the renderer waits for your animation to finish before doing anything else.</strong>
      </>
    ),
    lifecycle: {
      load: "Get data",
      play: "Animate in",
      update: "Change data",
      stop: "Animate out",
      dispose: "Clean up",
    },
    howTitle: "How it works",
    how: [
      <><strong>_initDom()</strong> — A private helper, idempotent. The first public method to run calls it to set <code className={CODE_BLUE}>innerHTML</code> + grab element refs. This way the graphic works whether the renderer inserts the element before or after calling <code className={CODE_BLUE}>load()</code>.</>,
      <><strong>load()</strong> — Receives the operator's data (name + title) and puts it in the DOM. No animation yet.</>,
      <><strong>playAction()</strong> — Works out which step to go to from <code className={CODE_BLUE}>goto</code> / <code className={CODE_BLUE}>delta</code>, exactly as the spec defines it. A lower third has one step, so the first play lands on step 0: it adds the <code className={CODE_BLUE}>.visible</code> class, waits 700ms for the slide-in, and reports <code className={CODE_BLUE}>currentStep: 0</code>. A second play goes past the last step, so the graphic leaves the air and reports <code className={CODE_BLUE}>currentStep: undefined</code> — that is what a controller's "next" button relies on.</>,
      <><strong>updateAction()</strong> — Swaps the text content. The check is <code className={CODE_BLUE}>!== undefined</code> rather than truthiness, so an operator who empties a field actually clears it. In production you'd add a smooth text-swap animation.</>,
      <><strong>stopAction()</strong> — Adds the <code className={CODE_BLUE}>.out</code> class for the exit animation and waits 500ms. Every action bumps <code className={CODE_BLUE}>_rev</code>, and the stop only hides the graphic if nothing newer has started — otherwise an operator who hits play again mid-exit would end up with an empty screen.</>,
      <><strong>customAction()</strong> — OGraf requires every graphic to expose this, even without any declared in the manifest. It receives <code className={CODE_BLUE}>{"{ id, payload, skipAnimation }"}</code>; with nothing declared, answering every <code className={CODE_BLUE}>id</code> with a 4xx such as <code className={CODE_BLUE}>statusCode: 404</code> is the right default.</>,
      <><strong>dispose()</strong> — Clears the DOM and resets <code className={CODE_BLUE}>_initialized</code> so a re-load rebuilds cleanly. Called when the graphic is removed from the renderer entirely.</>,
    ],
  },
  step6: {
    title: "Test it",
    body: "Your graphic is ready. Here's how to test it:",
    optionA: {
      title: "Option A: Use the live demo above",
      desc: "Scroll up — the interactive preview at the top of this page is running the exact same code. Click Play, change the text, click Update, click Stop.",
    },
    optionB: {
      title: "Option B: Check your package",
      desc: (rules: number) => `Zip your folder and drop it on /check. You'll get a structured report against ${rules} rules and the live EBU schema.`,
      link: "Open checker",
    },
    optionC: {
      title: "Option C: Load it in an OGraf renderer",
      desc: "Deploy to a compliant renderer: ograf-server (self-hosted reference), SPX-GC (browser controller), or CasparCG (via the HTML producer). Links are on the download card below.",
    },
  },
  downloadTitle: "CBS-Style Lower Third",
  done: {
    title: "You built an OGraf graphic.",
    body: "This package works with any OGraf-compatible system — SPX, ograf-server, CasparCG (via HTML producer), and more. Same files, everywhere.",
    spec: "Read the full spec",
    more: "Browse more templates",
  },
};

export type GetStartedCopy = typeof en;
