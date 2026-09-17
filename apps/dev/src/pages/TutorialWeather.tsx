import { Link } from "../i18n/Link";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import manifestJson from "../../public/templates/weather/weather.ograf.json";
import GRAPHIC_SOURCE from "../../public/templates/weather/graphic.mjs?raw";
import STYLE_SOURCE from "../../public/templates/weather/style.css?raw";
import { excerpt, cssExcerpt } from "../lib/excerpt";
import { useRouteMeta } from "../hooks/useMeta";

const MANIFEST = JSON.stringify(manifestJson, null, 2);
const RENDER_CODE = excerpt(GRAPHIC_SOURCE, ["_renderForecast", "_applyData"]);
const PLAY_CODE = excerpt(GRAPHIC_SOURCE, ["resolveTargetStep", "playAction", "stopAction"]);
const WEATHER_CSS = cssExcerpt(STYLE_SOURCE, [
  ":where(.weather-root, .weather-root *)",
  ".weather",
  ".weather.visible",
  ".weather.out",
  ".weather-forecast-day",
  ".weather.visible .weather-forecast-day",
]);

export function TutorialWeather() {
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
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Intermediate</span>
            <span className="text-xs text-slate-400">20 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a weather forecast card.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Weather graphics are a broadcast staple — from local news segments to national forecasts. This card shows current conditions with a large temperature display, plus a multi-day forecast row. It demonstrates how to handle <strong className="text-slate-900">nested data schemas</strong> — scalar fields plus an array of objects — in a single graphic.
          </p>
        </div>

        <div className="mb-16">
          <TemplateDemo
            src="/templates/weather/demo.html"
            fields={[
              { key: "location", label: "Location", defaultValue: "London" },
              { key: "temp", label: "Temperature", defaultValue: "18\u00B0C" },
              { key: "condition", label: "Condition", defaultValue: "Partly Cloudy" },
              { key: "icon", label: "Icon (emoji)", defaultValue: "\u26C5" },
              { key: "forecast", label: "Forecast", type: "json" as const, defaultValue: [
                { day: "Tue", temp: "20\u00B0C", icon: "\u2600\uFE0F" },
                { day: "Wed", temp: "16\u00B0C", icon: "\uD83C\uDF27\uFE0F" },
                { day: "Thu", temp: "19\u00B0C", icon: "\u26C5" },
              ]},
            ]}
            title="Weather — OGraf Template"
          />
        </div>

        <div className="space-y-16">

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">What's different from other graphics?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Nested data schema</p>
                <p className="text-sm text-slate-600 mt-1">Four scalar fields (location, temp, condition, icon) sit alongside an array of forecast objects, each with day, temp, and icon. Temperatures are plain strings, so the unit travels with the value.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Emoji as icons</p>
                <p className="text-sm text-slate-600 mt-1">Icons are Unicode emoji typed straight into the data and written out as text. No SVGs or icon fonts — zero dependencies, and viewers instantly recognize them.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Multi-section layout</p>
                <p className="text-sm text-slate-600 mt-1">Two visual zones: the current conditions (large icon + temp) and a compact forecast row below, whose days fade in after the card has slid into place.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the forecast row</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderForecast</code> maps the forecast array to one <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.weather-forecast-day</code> per entry, showing the day, the emoji, and the temperature. Every value passes through <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">escapeHtml</code>, and each day's <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">transition-delay</code> is 500 ms + 60 ms per day, creating a left-to-right reveal. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">load</code> and <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">updateAction</code> share <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_applyData</code>: scalar fields are applied when they are not <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">undefined</code> (so an empty string clears one), and a forecast array re-renders the row.
            </p>
            <CodeBlock filename="graphic.mjs (rendering)" language="JavaScript" code={RENDER_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Playing it on air</h2>
            <p className="text-base text-slate-700 mb-4">
              <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">resolveTargetStep</code> follows the OGraf step model: <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">goto</code> if given, otherwise the current step (-1 before the first play) plus <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">delta</code>, default 1. With one step, the first play puts the card on air at step 0; a second play goes past the end, so the graphic stops and returns <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">currentStep: undefined</code>. <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">playAction</code> adds <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> and resolves after 1000 ms; <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">stopAction</code> adds <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">out</code>, waits 500 ms, and clears the classes only if no newer action has bumped <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">this._rev</code> — so play → stop → play sent without waiting ends on air.
            </p>
            <CodeBlock filename="graphic.mjs (step model)" language="JavaScript" code={PLAY_CODE} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — slide-in card</h2>
            <p className="text-base text-slate-700 mb-4">
              The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">.weather</code> wrapper starts off-screen to the left, transparent and blurred. Adding <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">visible</code> slides it in over 0.7 s while it sharpens; <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">out</code> slides it back over 0.5 s. The forecast days rise 8px and fade in once the wrapper is visible, each with its own delay. The reset is scoped with <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">:where(.weather-root, …)</code>, so it never restyles the renderer's page.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={WEATHER_CSS} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                If temperatures update while the card is on air, consider adding <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">font-variant-numeric: tabular-nums</code> to <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">.weather-temp</code> (the template doesn't set it). Tabular digits all take the same width, so a change from "8°C" to "9°C" won't nudge the layout.
              </p>
            </div>
          </div>

          <TutorialManifest slug="weather" title="Weather Forecast" manifest={MANIFEST} intro="The forecast field mixes scalar props with a typed array — that's how OGraf handles multi-section data in a single schema." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Weather card complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Nested data, emoji icons, a slide-in card and a staggered forecast reveal — ready for any weather segment.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tutorials/social-card" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">Next: Social Card</Link>
              <Link to="/tutorials" className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">All tutorials</Link>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <TutorialCards exclude="/tutorials/weather" />
        </div>

      </div>
    </section>
  );
}
