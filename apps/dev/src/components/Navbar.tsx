import { useState } from "react";
import { Link } from "react-router";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link to="/" aria-label="Home" className="flex items-center">
              <span className="font-display text-xl font-semibold text-slate-900">
                ograf<span className="text-blue-600">.dev</span>
              </span>
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <Link to="/tutorials" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                Tutorials
              </Link>
              <Link to="/ecosystem" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                Ecosystem
              </Link>
              <Link to="/history" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                History
              </Link>
              <a href="https://ograf.tools" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                Tools
              </a>
              <Link to="/spec" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                Spec
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <a href="https://github.com/ebu/ograf" target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                GitHub
              </a>
            </div>
            <Link
              to="/get-started"
              className="group inline-flex items-center justify-center rounded-full bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span>Get started</span>
            </Link>
            <div className="-mr-1 md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-10 flex h-8 w-8 items-center justify-center"
                aria-label="Toggle Navigation"
              >
                <svg aria-hidden="true" className="h-3.5 w-3.5 overflow-visible stroke-slate-700" fill="none" strokeWidth={2} strokeLinecap="round">
                  {menuOpen ? (
                    <path d="M2 2L12 12M12 2L2 12" />
                  ) : (
                    <path d="M0 1H14M0 7H14M0 13H14" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {menuOpen && (
          <div className="absolute inset-x-4 top-24 z-50 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5">
            <Link to="/tutorials" className="block w-full p-2" onClick={() => setMenuOpen(false)}>Tutorials</Link>
            <Link to="/ecosystem" className="block w-full p-2" onClick={() => setMenuOpen(false)}>Ecosystem</Link>
            <Link to="/history" className="block w-full p-2" onClick={() => setMenuOpen(false)}>History</Link>
            <a href="https://ograf.tools" className="block w-full p-2" onClick={() => setMenuOpen(false)}>Tools</a>
            <hr className="m-2 border-slate-300/40" />
            <a href="https://github.com/ebu/ograf" className="block w-full p-2" onClick={() => setMenuOpen(false)}>GitHub</a>
          </div>
        )}
      </div>
    </header>
  );
}
