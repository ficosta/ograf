import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { TemplateDemo } from "../components/TemplateDemo";
import { TutorialCards } from "../components/TutorialCards";
import { CodeBlock } from "../components/CodeBlock";
import { TutorialManifest } from "../components/TutorialManifest";
import tutorials from "../content/tutorials.json";
import manifestJson from "../../public/templates/weather/weather.ograf.json";
import { useMeta } from "../hooks/useMeta";

const TUTORIAL = tutorials.find((t) => t.slug === "/tutorials/weather");
const MANIFEST = JSON.stringify(manifestJson, null, 2);

export function TutorialWeather() {
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
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Intermediate</span>
            <span className="text-xs text-slate-400">20 min</span>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Build a weather forecast card.</h1>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Weather graphics are a broadcast staple — from local news segments to national forecasts. This card shows current conditions with a large temperature display, plus a multi-day forecast row. It demonstrates how to handle <strong className="text-slate-900">complex nested data schemas</strong> with arrays and multiple sections in a single graphic.
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
                <p className="text-sm text-slate-600 mt-1">The data includes scalar fields (location, temp) alongside an array of forecast objects — each with day, icon, high, and low. This is the most complex schema in the tutorials.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Emoji as icons</p>
                <p className="text-sm text-slate-600 mt-1">Uses Unicode emoji for weather icons instead of SVGs or icon fonts. Zero dependencies, works everywhere, and viewers instantly recognize them.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Multi-section layout</p>
                <p className="text-sm text-slate-600 mt-1">Two distinct visual zones: the main current-conditions section (large icon + temp) and the compact forecast row below — each animating independently.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">Rendering the forecast row</h2>
            <p className="text-base text-slate-700 mb-4">
              The <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">_renderForecast</code> method iterates over the forecast array, creating a compact card for each day. Each card shows the day name, an emoji icon, and high/low temperatures. The staggered delay creates a left-to-right reveal.
            </p>
            <CodeBlock filename="graphic.mjs (key parts)" language="JavaScript" code={`_renderForecast(forecast) {
  const row = this.querySelector('.forecast-row');
  row.innerHTML = '';

  forecast.forEach((day, i) => {
    const card = document.createElement('div');
    card.className = 'forecast-day';
    card.style.transitionDelay = \`\${(i * 100) + 400}ms\`;

    // Convert hex code point to emoji
    const emoji = String.fromCodePoint(parseInt(day.icon, 16));

    card.innerHTML = \`
      <div class="forecast-day-name">\${day.day}</div>
      <div class="forecast-icon">\${emoji}</div>
      <div class="forecast-temps">
        <span class="forecast-high">\${day.high}°</span>
        <span class="forecast-low">\${day.low}°</span>
      </div>
    \`;

    row.appendChild(card);
  });
}

async load({ data }) {
  if (data?.location) this._location.textContent = data.location;
  if (data?.temp) this._temp.textContent = data.temp + '°';
  if (data?.condition) this._condition.textContent = data.condition;
  if (data?.icon) {
    this._icon.textContent = String.fromCodePoint(
      parseInt(data.icon, 16)
    );
  }
  if (data?.forecast) this._renderForecast(data.forecast);
  return { statusCode: 200 };
}

async playAction() {
  this._root.classList.add('visible');
  await new Promise(r => setTimeout(r, 1000));
  return { statusCode: 200, currentStep: 0 };
}`} />
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900 mb-4">The CSS — compact card layout</h2>
            <p className="text-base text-slate-700 mb-4">
              The weather card uses a two-part vertical layout. The main section holds the current conditions large and prominent, while the forecast row is compact with evenly-spaced day cards.
            </p>
            <CodeBlock filename="style.css (key parts)" language="CSS" code={`.weather-card {
  position: fixed;
  bottom: 60px;
  left: 48px;
  width: 380px;
  background: rgba(15, 15, 30, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.weather-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.weather-main {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-temp {
  font-size: 56px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.weather-icon-large {
  font-size: 48px;
}

.forecast-row {
  display: flex;
  justify-content: space-around;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.forecast-day {
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  /* transition-delay set per card via JS */
}

.visible .forecast-day {
  opacity: 1;
  transform: translateY(0);
}

.forecast-high {
  color: white;
  font-weight: 600;
}

.forecast-low {
  color: rgba(255, 255, 255, 0.4);
  margin-left: 4px;
}`} />
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900">Design tip</p>
              <p className="mt-2 text-sm text-amber-800">
                Use <code className="font-mono text-xs bg-amber-200 px-1 py-0.5 rounded">font-variant-numeric: tabular-nums</code> on temperature values so digits always take the same width. Without this, numbers like "8" and "18" have different widths, causing the layout to shift when temperatures change — a common visual glitch in weather graphics.
              </p>
            </div>
          </div>

          <TutorialManifest slug="weather" title="Weather Forecast" manifest={MANIFEST} intro="The forecast field mixes scalar props with a typed array — that's how OGraf handles multi-section data in a single schema." />

          <div className="rounded-2xl bg-blue-600 p-8 text-center">
            <Check className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl tracking-tight text-white">Weather card complete.</h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">Nested data schemas, emoji icons, and a multi-section layout with staggered forecast reveal — ready for any weather segment.</p>
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
