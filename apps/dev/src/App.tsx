import { Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Tutorials } from "./pages/Tutorials";
import { GetStarted } from "./pages/GetStarted";
import { TutorialBug } from "./pages/TutorialBug";
import { TutorialTicker } from "./pages/TutorialTicker";
import { TutorialQuote } from "./pages/TutorialQuote";
import { Ecosystem } from "./pages/Ecosystem";
import { About } from "./pages/About";
import { History } from "./pages/History";
import { Spec } from "./pages/Spec";

export function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/tutorials/bug" element={<TutorialBug />} />
          <Route path="/tutorials/ticker" element={<TutorialTicker />} />
          <Route path="/tutorials/quote" element={<TutorialQuote />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/history" element={<History />} />
          <Route path="/spec" element={<Spec />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
