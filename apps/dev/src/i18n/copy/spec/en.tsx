import { CODE, EXTERNAL_LINK, FIELD, MONO, STRONG } from "./styles";

export const en = {
  eyebrow: "Specification Guide",
  title: "How OGraf works — explained simply.",
  intro: (
    <>
      Whether you're a designer, developer, or broadcaster, this guide explains the OGraf format in plain language with real examples. No prior experience needed. For the full technical specification, see the{" "}
      <a href="https://ograf.ebu.io" target="_blank" rel="noopener noreferrer" className={EXTERNAL_LINK}>
        official EBU documentation
      </a>.
    </>
  ),
  onThisPage: "On this page",
  analogyLabel: "Think of it this way",
  nav: {
    "big-picture": "The Big Picture",
    "whats-inside": "What's Inside a Package",
    manifest: "The Manifest File",
    lifecycle: "How a Graphic Comes to Life",
    steps: "Steps (Multi-Page Graphics)",
    data: "Data & Forms",
    "real-world": "Real-World Examples",
    advanced: "Advanced Topics",
    next: "Next Steps",
  },

  bigPicture: {
    title: "The big picture",
    p1: "Imagine you design a lower third in After Effects. Today, you'd export it differently for every system — one version for CasparCG, another for SPX, another for Vizrt. Each with its own format, quirks, and limitations.",
    p2: (
      <>
        <strong className={STRONG}>OGraf eliminates that.</strong> You build your graphic once as a small web page (HTML + CSS + JavaScript), wrap it in a standard package, and it plays on <em>any</em> OGraf-compatible system. Same file, everywhere.
      </>
    ),
    rolesCaption: "The three roles in the OGraf ecosystem",
    roles: [
      { title: "You create", desc: "Design the graphic using HTML, CSS, and JavaScript — the same tools used to build websites." },
      { title: "You package", desc: "Add a manifest file that describes your graphic — its name, data fields, and behavior." },
      { title: "It plays", desc: "Any OGraf-compatible playout system (SPX, CasparCG, ograf-server…) can load and run it." },
    ],
    analogy: "Think of OGraf like a PDF. A PDF looks the same whether you open it in Adobe Reader, Chrome, or Preview. An OGraf graphic works the same whether it runs on SPX, CasparCG, or any other compatible system. The format is the contract.",
  },

  inside: {
    title: "What's inside a package",
    intro: "An OGraf package is just a folder with a few files. No special software needed to create one — you can build it with any text editor.",
    caption: "A typical OGraf package for a lower third",
    tree: {
      manifest: "← The manifest (required)",
      code: "← Your graphic code",
      styles: "← Your styles",
      thumbnail: "← Preview image",
      font: "← Custom font",
      logo: "← Logo or images",
    },
    required: (
      <>
        Two files are required: the manifest (<code className={CODE}>.ograf.json</code>) and the JavaScript module its <code className={CODE}>main</code> field points to. Everything else is up to you — bundle any fonts, images, CSS or JavaScript libraries the graphic needs inside the package.
      </>
    ),
    calloutTitle: "For After Effects designers",
    callout: (
      <>
        If you use tools like <strong>Ferryman</strong> or <strong>Loopic</strong>, they generate this package for you automatically. You design visually, and the tool exports an OGraf-ready folder. No coding required.
      </>
    ),
  },

  manifest: {
    title: "The manifest file",
    p1: (
      <>
        The manifest is a small JSON file that <strong className={STRONG}>describes your graphic to the world</strong>. It answers questions like: What's this graphic called? What data does it need? How does it behave?
      </>
    ),
    p2: (
      <>
        When someone loads your graphic in SPX or any other controller, <strong className={STRONG}>the controller reads this file first</strong>. It uses the information to show the graphic's name in the template list, generate data entry forms for the operator, and know how to control playback.
      </>
    ),
    breakdown: "Let's break down each part:",
    identity: {
      title: "Identity — who is this graphic?",
      subtitle: "id, version, name, description, author",
      body: (
        <>
          <p><code className={FIELD}>id</code> — A unique identifier, like a product barcode. Use your company domain reversed: <code className={MONO}>com.mystation.lower-third</code></p>
          <p><code className={FIELD}>name</code> — The friendly name operators see in the template list: <em>"News Lower Third"</em></p>
          <p><code className={FIELD}>version</code> — So systems know which version they're running: <em>"1.0.0"</em>, <em>"2.3.1"</em></p>
          <p><code className={FIELD}>description</code> — A short sentence explaining what the graphic does</p>
          <p><code className={FIELD}>author</code> — Your name and contact info</p>
        </>
      ),
    },
    code: {
      title: "Code — where's the graphic?",
      subtitle: "main",
      body: (
        <>
          <p><code className={FIELD}>main</code> — The path to the JavaScript file that contains your graphic's logic. This is where the animation, data handling, and rendering code lives.</p>
          <p>Example: <code className={MONO}>"graphic.mjs"</code> — a file in the same folder as the manifest.</p>
        </>
      ),
    },
    behavior: {
      title: "Behavior — how does it work?",
      subtitle: "stepCount, supportsRealTime, supportsNonRealTime",
      body: (
        <>
          <p><code className={FIELD}>stepCount</code> — How many "pages" or states does this graphic have? A simple lower third has <strong>1 step</strong> (it appears, then disappears). Election results with multiple pages might have <strong>5 steps</strong>. More on this below.</p>
          <p><code className={FIELD}>supportsRealTime</code> — Can this graphic run live on air? (Almost always <code className={MONO}>true</code>)</p>
          <p><code className={FIELD}>supportsNonRealTime</code> — Can this graphic be rendered frame-by-frame for post-production? (Advanced feature, usually <code className={MONO}>false</code>)</p>
        </>
      ),
    },
    data: {
      title: "Data — what information does it display?",
      subtitle: "schema",
      body: (
        <>
          <p>The <code className={FIELD}>schema</code> tells controllers <strong>what fields the operator needs to fill in</strong>. The controller reads this and auto-generates a form — text boxes, color pickers, dropdown menus — so the operator never touches code.</p>
          <p>In the example above, the schema says: <em>"This graphic needs a Name (text) and a Title (text)."</em> The controller shows two text inputs. The operator types "Jane Smith" and "Senior Reporter," clicks Play, and the lower third appears on screen with that data.</p>
        </>
      ),
    },
    analogy: "The manifest is like the back of a board game box. It tells you the game's name, how many players it supports, what's included, and the basic rules — before you even open it. Controllers read the manifest to know how to present and operate your graphic.",
  },

  lifecycle: {
    title: "How a graphic comes to life",
    intro: 'When an operator clicks "Play" in their controller (like SPX), a precise sequence happens behind the scenes: the renderer calls these methods on the graphic, in this order. Understanding this sequence is key to understanding OGraf. Graphics can also declare custom actions — a goal flash on a scoreboard, say — which controllers show as extra buttons and deliver through customAction().',
    caption: "The lifecycle of an OGraf graphic during a live broadcast",
    steps: [
      { action: "load()", what: "The graphic receives the operator's data (name, title, colors…) and gets ready.", example: 'Operator fills in "Jane Smith" and "Reporter" in the form.' },
      { action: "playAction()", what: "The graphic animates onto screen. The lower third slides in from the left.", example: "Director clicks Play. The name super smoothly animates in." },
      { action: "updateAction()", what: "Data changes while the graphic is on-air. The text updates live.", example: 'Title changes from "Reporter" to "Senior Correspondent" mid-show.' },
      { action: "stopAction()", what: "The graphic animates off screen. The lower third slides back out.", example: "Director clicks Stop. The graphic animates out cleanly." },
      { action: "dispose()", what: "Everything is cleaned up. Memory released. Ready for the next graphic.", example: "System clears the graphic from the renderer's memory." },
    ],
    body: (
      <>
        Each of these steps is a <strong className={STRONG}>method in your code</strong>. The renderer calls them in order, and <strong className={STRONG}>waits for each to finish</strong> before calling the next. This means: when you tell the renderer "my animation takes 500ms," it respects that and doesn't interrupt.
      </>
    ),
    calloutTitle: "The key insight",
    callout: (
      <>
        OGraf doesn't care <em>how</em> you animate your graphic — CSS transitions, JavaScript, GSAP, Lottie, canvas, SVG — anything works. It only cares <em>when</em> you're done. Signal "I'm ready" and the renderer moves on.
      </>
    ),
  },

  steps: {
    title: "Steps — for multi-page graphics",
    intro: (
      <>
        Not every graphic is a simple lower third. Election results might have 5 pages. A sports scoreboard might update dynamically. OGraf handles this with <strong className={STRONG}>steps</strong>.
      </>
    ),
    examples: (list: string) => `Examples: ${list}`,
    models: [
      { label: "Fire-and-forget", desc: "Played once, it runs from start to end on its own — in, hold, out. There are no steps for the operator to advance.", examples: "Replay sting, transition wipe, bumper animation", visual: ["▶️ In", "✨ Auto", "⏹️ Out"] },
      { label: "Single step (most common)", desc: "Appears when played, stays visible, disappears when stopped.", examples: "Lower third, bug, logo watermark, clock", visual: ["▶️ In", "⏸️ Hold", "⏹️ Out"] },
      { label: "Multi-step", desc: "Each Play advances to the next page. Stop exits from any page.", examples: "Election results (3 parties), multi-stat graphic, slideshow", visual: ["▶️ Page 1", "▶️ Page 2", "▶️ Page 3", "⏹️ Out"] },
      { label: "Dynamic steps", desc: "Number of pages depends on the data — could be 2 or 20.", examples: "Data-driven tables, live leaderboards, scrolling lists", visual: ["▶️ Page 1", "▶️ ...", "▶️ Page N", "⏹️ Out"] },
    ],
  },

  data: {
    title: "Data and forms",
    p1: (
      <>
        The most powerful part of OGraf for designers: <strong className={STRONG}>you define what data your graphic needs, and the controller automatically builds a form for the operator</strong>. No custom UI required.
      </>
    ),
    p2: (
      <>
        This is done through the <code className={CODE}>schema</code> in your manifest, using a format called <strong className={STRONG}>GDD</strong> (Graphics Data Definition). Don't let the name intimidate you — it's just a way to say "this graphic needs a text field called Name and a color picker called Background."
      </>
    ),
    caption: "What the operator sees vs. what you write in the manifest",
    operatorSees: "What the operator sees",
    youWrite: "What you write in the manifest",
    form: {
      headline: "Headline",
      headlineValue: "Breaking News",
      bgColor: "Background Color",
      position: "Position",
      positionValue: "Left ▾",
      duration: "Animation Duration",
    },
    fieldTypesTitle: "Available field types",
    fieldTypesIntro: (
      <>
        The <code className={CODE}>gddType</code> tells the controller what kind of input to show. Here are the options:
      </>
    ),
    fieldTypes: {
      "single-line": "Text input (one line)",
      "multi-line": "Text area (multiple lines)",
      select: "Dropdown menu with choices",
      "color-rrggbb": "Color picker",
      "color-rrggbbaa": "Color picker with transparency",
      "file-path": "File browser",
      "file-path/image-path": "Image file browser",
      percentage: "Percentage slider",
      "duration-ms": "Duration in milliseconds",
    },
  },

  realWorld: {
    intro: "Every concept in this spec maps to something real you can build. Each tutorial walks you through one complete OGraf graphic — manifest, Web Component, animation, data — in 10 to 25 minutes.",
    cardsTitle: "Real-world examples",
    cardsSubtitle: "Pick one and build it. Every example ships as a working OGraf package.",
  },

  advanced: {
    title: "Advanced topics",
    intro: "These features are less common but important for specialized workflows.",
    customActions: {
      title: "Custom Actions",
      subtitle: "Graphic-specific buttons for operators",
      body: (
        <>
          <p>Beyond play/stop/update, you can define <strong>custom operations</strong> with their own buttons and data forms. A scoreboard might have a "Goal Scored" button that triggers a celebration animation. A ticker might have an "Add Item" button.</p>
          <p className="mt-2">You define them in the manifest, and controllers auto-generate the UI — the operator just clicks a button.</p>
        </>
      ),
    },
    renderRequirements: {
      title: "Render Requirements",
      subtitle: "What the playout system needs to support",
      body: <p>If your graphic needs a specific resolution (e.g., 1920x1080 minimum), frame rate (e.g., 50fps), or minimum browser engine version, you can declare it — along with whether it needs access to the public internet. renderRequirements is a list of alternatives: the graphic is expected to work when the renderer meets at least one of them.</p>,
    },
    nonRealTime: {
      title: "Non-Real-Time Rendering",
      subtitle: "Frame-by-frame for post-production",
      body: <p>For video editing and post-production, renderers can step through your graphic frame-by-frame instead of playing in real time. This produces perfect-quality output for pre-recorded content. Your graphic needs two extra methods: one to jump to a specific time, and one to receive the full action timeline upfront.</p>,
    },
    vendorExtensions: {
      title: "Vendor Extensions",
      subtitle: "Custom fields for specific systems",
      body: <p>Any field starting with <code className={MONO}>v_</code> is reserved for vendor-specific data. SPX might add <code className={MONO}>v_spx_category</code>; CasparCG might add <code className={MONO}>v_casparcg_channel</code>. These fields are ignored by other systems — they don't break compatibility.</p>,
    },
  },

  next: {
    title: "Next steps",
    build: { title: "Build your first template", desc: "Hands-on tutorial. Zero to a working lower third in 15 minutes.", cta: "Start building" },
    spec: { title: "Official EBU specification", desc: "The full technical specification with JSON schemas and TypeScript types.", cta: "Read the spec" },
    ecosystem: { title: "Explore the ecosystem", desc: "Discover editors, renderers, controllers, and tools that support OGraf.", cta: "See all tools" },
    check: { title: "Check your package", desc: (total: number) => `Drop a .zip and get a structured report against ${total} rules and the live EBU schema.`, cta: "Open the checker" },
  },
};

export type SpecCopy = typeof en;
