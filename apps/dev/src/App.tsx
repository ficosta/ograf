import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Tutorials } from "./pages/Tutorials";
import { GetStarted } from "./pages/GetStarted";
import { TutorialBug } from "./pages/TutorialBug";
import { TutorialTicker } from "./pages/TutorialTicker";
import { TutorialQuote } from "./pages/TutorialQuote";
import { TutorialElectionBars } from "./pages/TutorialElectionBars";
import { TutorialSportLineup } from "./pages/TutorialSportLineup";
import { TutorialScoreBug } from "./pages/TutorialScoreBug";
import { TutorialCountdown } from "./pages/TutorialCountdown";
import { TutorialBreakingNews } from "./pages/TutorialBreakingNews";
import { TutorialWeather } from "./pages/TutorialWeather";
import { TutorialSocialCard } from "./pages/TutorialSocialCard";
import { Ecosystem } from "./pages/Ecosystem";
import { About } from "./pages/About";
import { History } from "./pages/History";
import { News } from "./pages/News";
import { Spec } from "./pages/Spec";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
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
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
