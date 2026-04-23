import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/social-card/social-card.ograf.json";
import { useMeta } from "../hooks/useMeta";

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/social-card");
const MANIFEST = JSON.stringify(manifestJson, null, 2);

export function TutorialSocialCard() {
  useMeta({
    title: (TUTORIAL?.title ?? "Tutorial") + " tutorial",
    description: TUTORIAL?.desc ?? undefined,
  });
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
                <p className="text-sm text-slate-600 mt-1">Uses <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">right: 48px</code> instead of <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">left</code>. This keeps the anchor visible on the left side of the frame — a common broadcast convention for displayed content.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Auto-generated avatar</p>
                <p className="text-sm text-slate-600 mt-1">No image needed. The avatar circle shows the user's initials, extracted from their name with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_getInitials()</code>. Works for any name, any language.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Platform badge</p>
                <p className="text-sm text-slate-600 mt-1">A small badge indicates the source platform (X, Instagram, etc.). This provides editorial transparency — viewers know where the post came from.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The initials method</h2>
            <p className="text-base text-slate-700 mb-4">
              Instead of requiring a profile photo URL (which may break, be low-res, or have rights issues), the social card generates an avatar from the user's name. The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_getInitials</code> method takes the first letter of each word in the name.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`_getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

// "Jane Smith"       → "JS"
// "Dr. Martin King"  → "DM"  (first two words)
// "Madonna"          → "M"
// ""                 → "?"

async load({ data }) {
  if (data?.user) {
    this._userName.textContent = data.user;
    this._avatar.textContent = this._getInitials(data.user);
  }
  if (data?.handle) this._handle.textContent = data.handle;
  if (data?.text) this._postText.textContent = data.text;
  return { statusCode: 200 };
}

async playAction() {
  this._root.classList.add('visible');
  await new Promise(r => setTimeout(r, 600));
  return { statusCode: 200, currentStep: 0 };
}

async stopAction() {
  this._root.classList.add('out');
  await new Promise(r => setTimeout(r, 400));
  this._root.classList.remove('visible', 'out');
  return { statusCode: 200 };
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — right-side card with blue accent</h2>
            <p className="text-base text-slate-700 mb-4">
              The card slides in from the right edge with a blue left-border accent. The avatar circle uses a gradient background that gives each card a unique but consistent feel.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.social-card {
  position: fixed;
  top: 50%;
  right: 48px;
  transform: translateY(-50%) translateX(30px);
  width: 360px;
  background: rgba(15, 15, 25, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border-left: 3px solid #3b82f6;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.5s ease,
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-card.visible {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.social-card.out {
  opacity: 0;
  transform: translateY(-50%) translateX(30px);
  transition-duration: 0.3s;
}

.social-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.social-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.social-user-name {
  font-weight: 600;
  color: white;
  font-size: 15px;
}

.social-handle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.social-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.5;
}

.social-platform {
  margin-top: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 1px;
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                The avatar circle uses the first letter of each word in the user's name — "Jane Smith" becomes "JS". This avoids the need for external image assets entirely. The gradient background ensures the circle always looks intentional, not like a missing image fallback.
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
