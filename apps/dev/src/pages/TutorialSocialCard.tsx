import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/social-card/social-card.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/social-card/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/social-card/style.css?raw";
import { useRouteMeta } from "../hooks/useMeta";
import { cssExcerpt, excerpt } from "../lib/excerpt";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const DATA_CODE = excerpt(GRAPHIC_SOURCE, ["_getInitials", "_applyData", "load"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction", "stopAction"]);
const CSS_CODE = cssExcerpt(STYLE_SOURCE, [
  ":where(.social-card-root, .social-card-root *)",
  ".social {",
  ".social.visible {",
  ".social.out",
  ".social-card::before",
  ".social-avatar {",
  ".social.visible .social-avatar",
]);

export function TutorialSocialCard() {
  useRouteMeta();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-4">
          <Link to="/tutorials" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
            <ChevronRight className="h-3 w-3 rotate-180" /> All tutorials
          </Link>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Beginner</span>
            <span className="text-xs text-slate-400">10 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a social media card.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            News broadcasts frequently show social media posts on screen — a tweet from a public figure, an official statement, or a viral post. This card displays the user's name, handle, and post text with an auto-generated avatar. It's positioned on the right side of the screen, leaving the anchor visible on the left.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/social-card/demo.html"
            fields={[
              { key: "user", label: "User Name", defaultValue: "Jane Smith" },
              { key: "handle", label: "Handle", defaultValue: "@janesmith" },
              { key: "text", label: "Post Text", defaultValue: "Excited to announce our new partnership with the European Broadcasting Union on open graphics standards. This is a huge step forward for interoperability in broadcast." },
            ]}
            title="Social Card — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Right-side position</p>
                <p className="text-sm text-slate-600 mt-1">Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">right: 48px; bottom: 80px</code> instead of <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">left</code>. This keeps the anchor visible on the left side of the frame — a common broadcast convention for displayed content.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Auto-generated avatar</p>
                <p className="text-sm text-slate-600 mt-1">No image needed. The avatar circle shows the user's initials, extracted from their name with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_getInitials()</code>. Nothing to host, nothing to break.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Two-stage entrance</p>
                <p className="text-sm text-slate-600 mt-1">The card slides in from off-screen right with a light blur over 0.7s, and the avatar pops in 0.35s later on an overshooting curve — all from CSS, keyed off one <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.visible</code> class.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The initials method</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of requiring a profile photo URL (which may break, be low-res, or have rights issues), the social card generates an avatar from the user's name. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_getInitials</code> splits the name on spaces, takes the first letter of each word, upper-cases them and keeps the first two: "Jane Smith" → "JS", "Dr. Martin King" → "DM", "Madonna" → "M", and an empty name → an empty avatar. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_applyData</code> is shared by <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load()</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction()</code>; it applies each field that is <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">!== undefined</code>, so a partial update touches only the fields you send and an empty string clears one. It also accepts an optional <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">platform</code> string for the dark badge in the header. The manifest schema doesn't declare it, so by default the badge is empty — and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.social-platform:empty</code> hides it rather than leaving a blank capsule.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={DATA_CODE} />
            <p className="text-base text-slate-700 mt-6 mb-4">
              Playing and stopping follow the OGraf step model. The first play puts the card on air at step 0 and resolves after 700ms; a second play goes past the single step, runs the stop and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. Every action bumps <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code>, and the stop only removes <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.visible</code> after its 500ms if nothing newer has started — so play → stop → play sent without waiting ends on air.
            </p>
            <CodeBlock filename="graphic.mjs (play and stop)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — right-side card with blue accent</h2>
            <p className="text-base text-slate-700 mb-4">
              The card slides in from the right edge: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.social</code> starts at <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">translateX(120%)</code>, transparent and blurred, and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.social.out</code> sends it back over 0.5s. A 4px gradient bar drawn with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">::before</code> gives the white card its blue left accent, and the avatar is a solid blue circle that scales up from 40%. The reset is scoped with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">:where(.social-card-root, …)</code> so it never restyles the renderer's page.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={CSS_CODE} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The avatar circle uses the first letter of each word in the user's name — "Jane Smith" becomes "JS". This avoids the need for external image assets entirely. The solid brand-blue fill and the delayed pop-in make the circle look intentional, not like a missing image fallback.
              </p>
            </div>
          </div>

          <TutorialManifest slug="social-card" title="Social Media Card" manifest={MANIFEST} />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Social card complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Right-side positioning, auto-generated initials avatar, and a clean blue accent — ready to display social posts on air.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/social-card" />
        </div>

      </div>
    </section>
  );
}
