export function Footer() {
  return (
    <footer className="border-t border-surface-800 bg-surface-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Learn</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://ograf.dev/get-started" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Get Started
                </a>
              </li>
              <li>
                <a href="https://ograf.dev/docs" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://ograf.dev/ecosystem" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Ecosystem
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Tools</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://ograf.tools/validate" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Validator
                </a>
              </li>
              <li>
                <a href="https://ograf.tools/preview" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Playground
                </a>
              </li>
              <li>
                <a href="https://ograf.tools/generate" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Generator
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://github.com/ebu/ograf" className="text-sm text-surface-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://ograf.dev/community" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://ograf.dev/blog" className="text-sm text-surface-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Official</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://ograf.ebu.io" className="text-sm text-surface-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  OGraf Specification
                </a>
              </li>
              <li>
                <a href="https://tech.ebu.ch/groups/html_graphics" className="text-sm text-surface-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  EBU Working Group
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-surface-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            Built by the community. Not affiliated with the EBU. Open source under MIT.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://ograf.dev" className="text-sm font-medium text-surface-400 hover:text-white transition-colors">
              ograf.dev
            </a>
            <span className="text-surface-700">|</span>
            <a href="https://ograf.tools" className="text-sm font-medium text-surface-400 hover:text-white transition-colors">
              ograf.tools
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
