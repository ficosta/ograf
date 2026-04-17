# Contributing

Thanks for wanting to improve ograf.dev. This is a community site and it gets better every time someone adds a tutorial, corrects a fact, or lists a new tool.

## Ground rules

- Be specific. "Fix a bug" in a PR title is less useful than "Fix stop animation in Lower Third tutorial".
- Keep changes focused. One topic per PR. Small, reviewable changes merge faster.
- Prefer JSON edits to TSX edits when the change is about content (tutorial metadata, ecosystem listing, FAQ).
- Don't add new top-level dependencies without discussion.

## Local setup

```
pnpm install
pnpm --filter=@ograf/dev dev
```

The site runs at http://localhost:5173. Build with `pnpm --filter=@ograf/dev build`.

## Adding a tutorial

1. Add an entry to `apps/dev/src/content/tutorials.json`. Follow the shape of existing entries.
2. Create the template in `apps/dev/public/templates/<slug>/` with `manifest.ograf.json`, `index.html`, `graphic.mjs`, `style.css`, `demo.html`, and `preview.html`.
3. Capture a 1920x1080 PNG preview and put it at `apps/dev/public/templates/previews/<slug>.png`. Playwright works well:

   ```
   npx playwright screenshot --viewport-size=1920,1080 --wait-for-timeout=3000 \
     http://localhost:5173/templates/<slug>/preview.html \
     apps/dev/public/templates/previews/<slug>.png
   ```

4. Optionally add a long-form walkthrough page at `apps/dev/src/pages/Tutorial<Name>.tsx` and register the route in `apps/dev/src/App.tsx`.
5. Open a PR. A maintainer will review and merge.

## Adding an ecosystem entry

Edit `apps/dev/src/content/ecosystem.json`. Each entry goes inside the most appropriate category and must include:

- `name` &mdash; short, recognisable project name
- `desc` &mdash; one or two sentences, no hype
- `url` &mdash; canonical project URL
- `type` &mdash; `oss`, `commercial`, or `official`
- `stars` &mdash; optional, GitHub star count if open source

Open a PR with a short justification. Scope is: projects that support OGraf, help produce OGraf packages, or serve the broadcast graphics community meaningfully.

## Correcting content

Typos, factual fixes, and clearer copy are always welcome. No issue required &mdash; just open the PR.

## Code style

- TypeScript strict mode is on. No `any`. Prefer `readonly` on component props.
- Use the existing Tailwind palette (blue-600 accent, slate neutrals). Don't introduce new brand colours without discussion.
- Keep components small. If a page is over 400 lines, consider splitting.

## Security / conduct

If you find a security issue, email the maintainer instead of opening a public issue.

Behave like a good neighbour. Disagreements are fine, personal attacks aren't.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
