# Draft email — OGraf mount portability clarification

**Suggested channel**: open a GitHub Discussion on
<https://github.com/ebu/ograf/discussions>. The EBU working group is active
there and responses benefit future template authors. If a direct email is
preferred, the repo's README points at EBU Technology & Innovation contacts.

---

**Subject:** OGraf v1 — clarifying the mount model and its implications for template authors (Shadow DOM, iframe, direct DOM)

Hello,

First, thank you for the work on OGraf v1. We're building a set of community
tutorials and a real ecosystem of downloadable templates for
[ograf.dev](https://ograf.dev), and while implementing them I ran into a
portability question that the specification intentionally leaves open. I'd
appreciate guidance so our tutorials teach the right patterns.

### The relevant spec text

> "The way a Graphic is added into and removed from a Renderer is
> non-normative."
> — `v1/specification/docs/Specification.md`

And elsewhere, the only hard constraints I could find are:

- The `main` module must `export default` a class extending `HTMLElement`.
- The class must implement `load / playAction / updateAction / stopAction /
  customAction / dispose`.
- The renderer is responsible for turning the default export into a registered
  custom element.

### What I observed in practice

Different real renderers mount the graphic in **very** different ways, and a
template author who only targets one of them ships a graphic that silently
breaks in the others:

1. **`ograf-devtool` (SuperFlyTV, MIT)** — attaches a **closed Shadow DOM** to
   a positioned `<div>`, then does
   `customElements.define('graphic-componentN', ClassFromDefaultExport)` and
   appends the element inside that shadow root.
   - External `style.css` is never reachable.
   - `connectedCallback` only fires in the live-render path (and not in the
     test harness, which calls `load()` on a detached element).
   - Any module-level `customElements.define` on the template side throws
     `NotSupportedError: this constructor has already been used with this
     registry` because the renderer then can't re-register the same class.

2. **Iframe-based renderers** (e.g. CasparCG's HTML producer, as we understand
   it) — mount the graphic inside an iframe, each with its own `document`.
   Here `position: fixed` anchors to the iframe's viewport; external
   stylesheets *can* be referenced from within the iframe.

3. **Direct DOM render** (hypothetical / simplest) — the element is just
   appended as a regular descendant of the body. Styles, fonts, and
   positioning behave like any normal page.

### Concrete questions

Our community tutorials need to pick one authoring pattern that works
identically across all three mount models. Based on the above we've
provisionally landed on:

- `position: absolute` only (never `fixed`), sized to a positioned container
  above the graphic.
- Styles inlined inside the component's `innerHTML` via a `<style>` tag, **or**
  — for `@font-face` rules specifically — injected into `document.head` from
  the component's initialisation code, since the [CSS scoping rules for
  at-rules in shadow DOM are known to be inconsistent across
  browsers](https://developer.chrome.com/docs/css-ui/css-names).
- Lazy idempotent DOM init called from every lifecycle method (never relying
  on `connectedCallback`).
- No `customElements.define` call in the graphic module.

Could the working group confirm or correct the following?

1. **Is Shadow DOM (or iframe) mounting intended to be a renderer choice, or
   will the specification eventually converge on one model?**
2. **Are template authors expected to be mount-agnostic?** If so, is the
   guidance above (`position: absolute`, inline `<style>`, `document.head`
   font injection, no self-`define`, lazy `load()`-driven init) the right
   default? Is there a canonical example we should be pointing at? The
   `v1/examples/minimal` and `v1/examples/l3rd-name` graphics use inline
   `element.style.*` rather than a `<style>` tag and never load custom fonts —
   is that the canonical style, or are `<style>` tags acceptable too?
3. **For custom fonts specifically**, what is the recommended pattern?
   `@font-face` inlined inside a shadow-scoped `<style>` has known browser
   quirks; `document.head` injection side-steps them but feels like it
   violates the graphic's self-containment. A formal recommendation would let
   us stop guessing.
4. **For `customElements.define`**, is the expectation codified anywhere that
   the default export class will be registered by the renderer, and that the
   module itself must not register? A single line in the spec would prevent a
   common first-time mistake.

Answers — even just pointers to a section we missed — would let us write a
tutorial that teaches first-time authors a pattern that actually ports across
every compliant system.

Thanks again for the spec and the reference tooling. Happy to contribute our
findings and a revised "authoring cheatsheet" section back to the
`v1/specification/docs/` folder as a PR if that's welcome.

— Felipe Iasi
<https://ograf.dev>
