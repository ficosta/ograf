import { Routes, Route } from "react-router";
import { Layout, NavLink } from "@ograf/ui";
import { Home } from "./pages/Home";
import { Validate } from "./pages/Validate";

function Nav() {
  return (
    <nav className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            ograf<span className="text-brand-400">.tools</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/validate">Validator</NavLink>
          <NavLink href="/preview">Playground</NavLink>
          <NavLink href="/explore">Schema Explorer</NavLink>
          <NavLink href="/generate">Generator</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NavLink href="https://ograf.dev" external>
          ograf.dev
        </NavLink>
        <NavLink href="https://github.com/ebu/ograf" external>
          GitHub
        </NavLink>
      </div>
    </nav>
  );
}

export function App() {
  return (
    <Layout nav={<Nav />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validate" element={<Validate />} />
      </Routes>
    </Layout>
  );
}
