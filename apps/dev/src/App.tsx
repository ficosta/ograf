import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Tutorials } from "./pages/Tutorials";
import { LOCALES, localizePath } from "./i18n/locales";
import { useT } from "./i18n/useLocale";

// Lazy-load the larger pages so the initial bundle stays small.
// Home and Tutorials stay eager because they are the most common entry points.
const GetStarted = lazy(() => import("./pages/GetStarted").then((m) => ({ default: m.GetStarted })));
const TutorialBug = lazy(() => import("./pages/TutorialBug").then((m) => ({ default: m.TutorialBug })));
const TutorialTicker = lazy(() => import("./pages/TutorialTicker").then((m) => ({ default: m.TutorialTicker })));
const TutorialQuote = lazy(() => import("./pages/TutorialQuote").then((m) => ({ default: m.TutorialQuote })));
const TutorialElectionBars = lazy(() => import("./pages/TutorialElectionBars").then((m) => ({ default: m.TutorialElectionBars })));
const TutorialSportLineup = lazy(() => import("./pages/TutorialSportLineup").then((m) => ({ default: m.TutorialSportLineup })));
const TutorialScoreBug = lazy(() => import("./pages/TutorialScoreBug").then((m) => ({ default: m.TutorialScoreBug })));
const TutorialCountdown = lazy(() => import("./pages/TutorialCountdown").then((m) => ({ default: m.TutorialCountdown })));
const TutorialBreakingNews = lazy(() => import("./pages/TutorialBreakingNews").then((m) => ({ default: m.TutorialBreakingNews })));
const TutorialWeather = lazy(() => import("./pages/TutorialWeather").then((m) => ({ default: m.TutorialWeather })));
const TutorialSocialCard = lazy(() => import("./pages/TutorialSocialCard").then((m) => ({ default: m.TutorialSocialCard })));
const Ecosystem = lazy(() => import("./pages/Ecosystem").then((m) => ({ default: m.Ecosystem })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const History = lazy(() => import("./pages/History").then((m) => ({ default: m.History })));
const News = lazy(() => import("./pages/News").then((m) => ({ default: m.News })));
const Spec = lazy(() => import("./pages/Spec").then((m) => ({ default: m.Spec })));
const CheckRules = lazy(() => import("./pages/CheckRules").then((m) => ({ default: m.CheckRules })));
const Check = lazy(() => import("./pages/Check").then((m) => ({ default: m.Check })));
const Tools = lazy(() => import("./pages/Tools").then((m) => ({ default: m.Tools })));
const SchemaExplorer = lazy(() => import("./pages/SchemaExplorer").then((m) => ({ default: m.SchemaExplorer })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

const PAGES: ReadonlyArray<readonly [path: string, Page: ComponentType]> = [
  ["/", Home],
  ["/tutorials", Tutorials],
  ["/get-started", GetStarted],
  ["/tutorials/bug", TutorialBug],
  ["/tutorials/ticker", TutorialTicker],
  ["/tutorials/quote", TutorialQuote],
  ["/tutorials/election-bars", TutorialElectionBars],
  ["/tutorials/sport-lineup", TutorialSportLineup],
  ["/tutorials/score-bug", TutorialScoreBug],
  ["/tutorials/countdown", TutorialCountdown],
  ["/tutorials/breaking-news", TutorialBreakingNews],
  ["/tutorials/weather", TutorialWeather],
  ["/tutorials/social-card", TutorialSocialCard],
  ["/ecosystem", Ecosystem],
  ["/history", History],
  ["/news", News],
  ["/spec", Spec],
  ["/tools", Tools],
  ["/tools/schema-explorer", SchemaExplorer],
  ["/check/rules", CheckRules],
  ["/check", Check],
  ["/about", About],
];

function RouteFallback() {
  const t = useT();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8" aria-busy="true">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-500" />
        </div>
        <p className="text-xs">{t.common.loading}</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {LOCALES.flatMap((locale) =>
              PAGES.map(([path, Page]) => {
                const localized = localizePath(path, locale);
                return <Route key={localized} path={localized} element={<Page />} />;
              }),
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
