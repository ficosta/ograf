import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Tutorials } from "./pages/Tutorials";

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
const Check = lazy(() => import("./pages/Check").then((m) => ({ default: m.Check })));
const Tools = lazy(() => import("./pages/Tools").then((m) => ({ default: m.Tools })));
const SchemaExplorer = lazy(() => import("./pages/SchemaExplorer").then((m) => ({ default: m.SchemaExplorer })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8" aria-busy="true">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-500" />
        </div>
        <p className="text-xs">Loading...</p>
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
            <Route path="/" element={<Home />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/tutorials/bug" element={<TutorialBug />} />
            <Route path="/tutorials/ticker" element={<TutorialTicker />} />
            <Route path="/tutorials/quote" element={<TutorialQuote />} />
            <Route path="/tutorials/election-bars" element={<TutorialElectionBars />} />
            <Route path="/tutorials/sport-lineup" element={<TutorialSportLineup />} />
            <Route path="/tutorials/score-bug" element={<TutorialScoreBug />} />
            <Route path="/tutorials/countdown" element={<TutorialCountdown />} />
            <Route path="/tutorials/breaking-news" element={<TutorialBreakingNews />} />
            <Route path="/tutorials/weather" element={<TutorialWeather />} />
            <Route path="/tutorials/social-card" element={<TutorialSocialCard />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/history" element={<History />} />
            <Route path="/news" element={<News />} />
            <Route path="/spec" element={<Spec />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/schema-explorer" element={<SchemaExplorer />} />
            <Route path="/check" element={<Check />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
