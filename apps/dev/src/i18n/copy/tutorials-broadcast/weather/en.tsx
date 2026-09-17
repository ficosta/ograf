import { CODE, CODE_AMBER, STRONG } from "../styles";

export const en = {
  title: "Build a weather forecast card.",
  intro: (
    <>
      Weather graphics are a broadcast staple — from local news segments to national forecasts. This card shows current conditions with a large temperature display, plus a multi-day forecast row. It demonstrates how to handle <strong className={STRONG}>nested data schemas</strong> — scalar fields plus an array of objects — in a single graphic.
    </>
  ),
  demoTitle: "Weather — OGraf Template",
  fields: { location: "Location", temp: "Temperature", condition: "Condition", icon: "Icon (emoji)", forecast: "Forecast" },
  differentTitle: "What's different from other graphics?",
  cards: [
    {
      title: "Nested data schema",
      body: <>Four scalar fields (location, temp, condition, icon) sit alongside an array of forecast objects, each with day, temp, and icon. Temperatures are plain strings, so the unit travels with the value.</>,
    },
    {
      title: "Emoji as icons",
      body: <>Icons are Unicode emoji typed straight into the data and written out as text. No SVGs or icon fonts — zero dependencies, and viewers instantly recognize them.</>,
    },
    {
      title: "Multi-section layout",
      body: <>Two visual zones: the current conditions (large icon + temp) and a compact forecast row below, whose days fade in after the card has slid into place.</>,
    },
  ],
  renderTitle: "Rendering the forecast row",
  renderBody: (
    <>
      <code className={CODE}>_renderForecast</code> maps the forecast array to one <code className={CODE}>.weather-forecast-day</code> per entry, showing the day, the emoji, and the temperature. Every value passes through <code className={CODE}>escapeHtml</code>, and each day's <code className={CODE}>transition-delay</code> is 500 ms + 60 ms per day, creating a left-to-right reveal. <code className={CODE}>load</code> and <code className={CODE}>updateAction</code> share <code className={CODE}>_applyData</code>: scalar fields are applied when they are not <code className={CODE}>undefined</code> (so an empty string clears one), and a forecast array re-renders the row.
    </>
  ),
  playTitle: "Playing it on air",
  playBody: (
    <>
      <code className={CODE}>resolveTargetStep</code> follows the OGraf step model: <code className={CODE}>goto</code> if given, otherwise the current step (-1 before the first play) plus <code className={CODE}>delta</code>, default 1. With one step, the first play puts the card on air at step 0; a second play goes past the end, so the graphic stops and returns <code className={CODE}>currentStep: undefined</code>. <code className={CODE}>playAction</code> adds <code className={CODE}>visible</code> and resolves after 1000 ms; <code className={CODE}>stopAction</code> adds <code className={CODE}>out</code>, waits 500 ms, and clears the classes only if no newer action has bumped <code className={CODE}>this._rev</code> — so play → stop → play sent without waiting ends on air.
    </>
  ),
  cssTitle: "The CSS — slide-in card",
  cssBody: (
    <>
      The <code className={CODE}>.weather</code> wrapper starts off-screen to the left, transparent and blurred. Adding <code className={CODE}>visible</code> slides it in over 0.7 s while it sharpens; <code className={CODE}>out</code> slides it back over 0.5 s. The forecast days rise 8px and fade in once the wrapper is visible, each with its own delay. The reset is scoped with <code className={CODE}>:where(.weather-root, …)</code>, so it never restyles the renderer's page.
    </>
  ),
  tipTitle: "Design tip",
  tipBody: (
    <>
      If temperatures update while the card is on air, consider adding <code className={CODE_AMBER}>font-variant-numeric: tabular-nums</code> to <code className={CODE_AMBER}>.weather-temp</code> (the template doesn't set it). Tabular digits all take the same width, so a change from "8°C" to "9°C" won't nudge the layout.
    </>
  ),
  manifestTitle: "Weather Forecast",
  manifestIntro: "The forecast field mixes scalar props with a typed array — that's how OGraf handles multi-section data in a single schema.",
  doneTitle: "Weather card complete.",
  doneBody: "Nested data, emoji icons, a slide-in card and a staggered forecast reveal — ready for any weather segment.",
  codeLabels: {
    rendering: "rendering",
    stepModel: "step model",
    keyParts: "key parts",
  },
  next: "Next: Social Card",
};

export type WeatherCopy = typeof en;
