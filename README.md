# ograf.dev

A community-driven portal for the OGraf open broadcast graphics standard. Tutorials, ecosystem directory, specification guide, and live interactive demos for every graphic type.

Not affiliated with the European Broadcasting Union. All content here complements the [official OGraf specification](https://tech.ebu.ch/ograf) without replacing it.

## What's inside

This is a monorepo containing two sibling sites:

- **`apps/dev`** &mdash; the site behind ograf.dev. Tutorials, spec guide, ecosystem map, history, news, and the homepage.
- **`apps/tools`** &mdash; the workbench behind ograf.tools. Browser-based validator, preview sandbox, schema explorer, and template generator.

Both are static React SPAs with no backend. Content lives in JSON files under `apps/dev/src/content/`.

## Tech stack

- Vite 6 + React 19 + TypeScript (strict mode)
- Tailwind CSS v4
- react-router 7 for client-side routing
- lucide-react for icons
- pnpm workspaces

## Project layout

```
ograf/
  apps/
    dev/                       ograf.dev
      public/
        templates/             broadcast graphic templates (HTML + CSS + JS)
      src/
        components/            shared UI (Navbar, Footer, TutorialCards, TemplateDemo)
        content/               JSON content files (single source of truth)
          tutorials.json       all 11 tutorials
          ecosystem.json       directory of tools and projects
          faq.json             homepage FAQ
          roles.json           role-based onboarding cards
          workflow.json        workflow diagram nodes
        pages/                 route components
    tools/                     ograf.tools
  scripts/
    gen-sitemap.mjs            build-time sitemap generator
  plan.html                    historical product plan
```

## Running locally

Requires Node 20+ and pnpm.

```
pnpm install
pnpm --filter=@ograf/dev dev
```

The ograf.dev app boots at http://localhost:5173.

To run the workbench:

```
pnpm --filter=@ograf/tools dev
```

Production build for both apps:

```
pnpm build
```

The sitemap (`apps/dev/public/sitemap.xml`) is regenerated automatically on each build from the route list + `tutorials.json`.

## Adding a new tutorial

1. Add an entry to `apps/dev/src/content/tutorials.json` with the tutorial metadata, demo config, and default data.
2. Create a template folder at `apps/dev/public/templates/<slug>/` containing:
   - `manifest.ograf.json` &mdash; the OGraf manifest
   - `index.html` &mdash; the entry point loaded by the renderer
   - `graphic.mjs` &mdash; the Web Component implementation
   - `style.css` &mdash; the graphic's styles
   - `demo.html` &mdash; a minimal host page that listens for postMessage to drive the lifecycle
   - `preview.html` &mdash; auto-playing variant used for the preview screenshot
3. Capture a preview screenshot and place it at `apps/dev/public/templates/previews/<slug>.png` (1920x1080).
4. If the tutorial needs a dedicated long-form walkthrough page, add it under `apps/dev/src/pages/Tutorial<Name>.tsx` and register the route in `apps/dev/src/App.tsx`.

## Adding an ecosystem entry

Edit `apps/dev/src/content/ecosystem.json` and add your project under the right category. Each item needs `name`, `desc`, `url`, and `type` (`oss`, `commercial`, or `official`). An optional `stars` field displays a star count.

## Contributing

Pull requests are welcome. Before submitting:

1. Run `pnpm --filter=@ograf/dev build` and confirm no errors.
2. Keep TypeScript strict: no `any`, prefer `readonly` on component props.
3. Don't add heavy dependencies without discussion. The site is intentionally lean.
4. Content changes should land in the relevant JSON file, not as hardcoded TSX.

See `CONTRIBUTING.md` for more detail.

## Acknowledgements

- The European Broadcasting Union (EBU) for authoring and stewarding the OGraf specification.
- SuperFlyTV, SPX Graphics, Loopic, StreamShapers, and the CasparCG community for ecosystem tooling and the long-running push toward open broadcast graphics.
- Everyone who has submitted a tutorial, ecosystem entry, or correction. This is a community site and it only works when people show up.

## License

MIT. See `LICENSE`.
