# Licensing

This repository uses a **layered, per-directory licensing model**. Each piece of content has the license that fits its purpose — permissive where we want maximum reuse, source-available where we want to keep the site itself ours.

## TL;DR

| What | License | What you can do |
|------|---------|-----------------|
| OGraf **templates** (`apps/dev/public/templates/**`) | **MIT** | Use, modify, redistribute, ship in production. No restrictions. |
| **Tutorial** content & code (`apps/dev/src/pages/Tutorial*.tsx`, `apps/dev/src/content/tutorials.json`, `apps/dev/src/components/{TutorialCards,TemplateDemo,CodeBlock}.tsx`) | **MIT** | Same as templates — copy any tutorial, fork it, ship it. |
| **Site infrastructure** (everything else under `apps/`, `packages/`) | **PolyForm Internal Use 1.0.0** | Read, run, fork, modify, **for internal use inside your organisation**. You may **not** redistribute, host as a service for others, or sell. |
| **Editorial content** (page copy, JSON content under `apps/dev/src/content/{news-items,events,presentations,videos,resources,ecosystem}.json`, blog text, About page text) | **CC BY 4.0** | Quote, translate, embed — attribute "ograf.dev" with a link. |
| **OGraf Specification itself** (the EBU spec) | **MIT** (per the EBU OGraf project, issue #63) | This is the upstream spec at https://github.com/ebu/ograf — not in this repo. |

## Why a layered model?

The goal is simple:

1. **People learning OGraf should be able to take any template or tutorial and ship it in their own production stack** — that's the point of having tutorials. So those are MIT.
2. **The website itself is our home.** Other broadcasters or vendors are welcome to fork it and stand up their own internal version, but it's not meant to be cloned and resold as a service. So the site code is PolyForm Internal Use 1.0.0.
3. **Editorial text deserves attribution.** If you quote our framing or translate our explainers, give credit and a link. So copy is CC BY 4.0.

This isn't OSI-approved "open source" across the board — site code is **source-available**. We're explicit about that to set correct expectations.

## Files

- `LICENSE` — root: PolyForm Internal Use 1.0.0 (default, applies to everything not overridden)
- `LICENSES/PolyForm-Internal-Use-1.0.0.md` — canonical text
- `LICENSES/MIT.txt` — canonical text
- `LICENSES/CC-BY-4.0.txt` — canonical text
- `apps/dev/public/templates/LICENSE` — MIT override for the templates directory

## Practical guidance

**I'm a designer/developer wanting to ship an OGraf graphic** — copy any template from `apps/dev/public/templates/`. It's MIT. No need to ask.

**I'm a broadcaster wanting an internal copy of this site for my team** — fork the repo. Run it internally. Modify it however you need. PolyForm Internal Use 1.0.0 covers you.

**I'm a vendor wanting to host this site as a paid service for clients** — that's not allowed under the site code license (PolyForm Internal Use 1.0.0). Email Felipe to discuss a commercial arrangement.

**I'm a journalist quoting the explainer copy** — go ahead. Attribution + link to the page is appreciated (CC BY 4.0).

**I want to translate the site** — yes, please. Editorial text is CC BY 4.0; the framework around it is PolyForm Internal Use 1.0.0 — fine for hosting your translated version internally for your organisation.

## Questions

Open an issue, or email felipeiasi@gmail.com.
