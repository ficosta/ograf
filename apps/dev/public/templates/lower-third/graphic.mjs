/**
 * OGraf Lower Third — clean slide-in name/title card.
 *
 * Designed for the OGraf iframe mount model: the renderer instantiates the
 * graphic inside its own document, so we load our stylesheet with a plain
 * <link> tag and keep all styling in style.css. URLs inside style.css
 * resolve relative to style.css's own location, which is exactly what we
 * want for the local fonts under ./fonts/.
 *
 * style.css is referenced via an absolute URL computed from import.meta.url
 * so it resolves wherever the package is served from.
 *
 * DOM init happens lazily in _initDom() rather than connectedCallback —
 * compliant renderers may instantiate the element without inserting it,
 * and load() is always the first method called.
 *
 * Do NOT call customElements.define() in this module — the renderer picks
 * the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="l3rd">
    <div class="l3rd-accent"></div>
    <div class="l3rd-content">
      <div class="l3rd-name"></div>
      <div class="l3rd-title"></div>
    </div>
  </div>
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The step a playAction() lands on, exactly as the spec defines it: `goto`
 * wins; otherwise the current step (-1 before the first play) plus `delta`,
 * which defaults to 1. A target at or past stepCount means "go to the end",
 * returned as undefined — so a second play on a one-step graphic takes it off
 * air instead of replaying it.
 */
function resolveTargetStep(currentStep, { goto, delta } = {}, stepCount = 1) {
  const target = Number.isInteger(goto) && goto >= 0
    ? goto
    : (currentStep ?? -1) + (Number.isInteger(delta) ? delta : 1);
  return target >= stepCount ? undefined : Math.max(target, 0);
}

export default class LowerThird extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.l3rd');
    this._name = this.querySelector('.l3rd-name');
    this._title = this.querySelector('.l3rd-title');
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.name !== undefined) this._name.textContent = data.name;
    if (data?.title !== undefined) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  // Each action takes the next revision number. Anything that finishes after a
  // newer action has started checks it and backs off, so play → stop → play
  // sent without waiting ends on air instead of hidden by the stale stop.
  async playAction({ goto, delta, skipAnimation } = {}) {
    this._initDom();
    const target = resolveTargetStep(this._step, { goto, delta });
    if (target === undefined) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }
    ++this._rev;
    this._step = target;
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('instant', 'visible');
      return { statusCode: 200, currentStep: this._step };
    }
    this._root.classList.remove('instant');
    // Force a reflow so the browser registers the starting state.
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await sleep(700);
    return { statusCode: 200, currentStep: this._step };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    this._step = undefined;
    if (skipAnimation) {
      this._root.classList.add('instant');
      this._root.classList.remove('visible', 'out');
      return { statusCode: 200 };
    }
    this._root.classList.remove('instant');
    this._root.classList.add('out');
    await sleep(500);
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data, skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      if (data?.name !== undefined) this._name.textContent = data.name;
      if (data?.title !== undefined) this._title.textContent = data.title;
      return { statusCode: 200 };
    }

    if (data?.name !== undefined && String(data.name) !== this._name.textContent) {
      this._name.classList.add('updating');
      setTimeout(() => { this._name.textContent = data.name; }, 140);
      setTimeout(() => { this._name.classList.remove('updating'); }, 350);
    }

    if (data?.title !== undefined && String(data.title) !== this._title.textContent) {
      this._title.classList.add('updating');
      setTimeout(() => { this._title.textContent = data.title; }, 140);
      setTimeout(() => { this._title.classList.remove('updating'); }, 350);
    }

    await new Promise(r => setTimeout(r, 350));
    return { statusCode: 200 };
  }

  // Every OGraf graphic must expose customAction, even without any declared.
  // The renderer passes { id, payload, skipAnimation }; an unknown id is a 4xx.
  async customAction({ id } = {}) {
    return { statusCode: 404, statusMessage: `Unknown custom action: ${id ?? ''}` };
  }

  async dispose() {
    this._rev = (this._rev ?? 0) + 1;
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
