/**
 * OGraf Bug / LIVE — corner indicator with a pulsing LIVE dot.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag whose URL is computed from import.meta.url,
 * so it resolves wherever the renderer serves the package from.
 *
 * DOM init is done lazily in _initDom() rather than connectedCallback —
 * renderers may instantiate the element without attaching it, and load()
 * is always the first method called.
 *
 * Do NOT call customElements.define() here — the renderer picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="bug">
    <div class="bug-container">
      <div class="bug-live">
        <div class="bug-live-ping"></div>
        <div class="bug-live-dot"></div>
      </div>
      <div class="bug-text">
        <div class="bug-label"></div>
        <div class="bug-sublabel"></div>
      </div>
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

export default class BugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.bug');
    this._label = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.label !== undefined) this._label.textContent = data.label;
    if (data?.sublabel !== undefined) this._sublabel.textContent = data.sublabel;
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
    await sleep(600);
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
    await sleep(400);
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.label !== undefined) this._label.textContent = data.label;
    if (data?.sublabel !== undefined) this._sublabel.textContent = data.sublabel;
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
