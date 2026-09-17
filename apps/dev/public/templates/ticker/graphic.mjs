/**
 * OGraf News Ticker — scrolling headline crawl with a seamless infinite loop.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag built from import.meta.url so the URL is
 * absolute regardless of where the renderer serves the package from.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define()
 * here — the renderer picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="ticker">
    <div class="ticker-bar">
      <div class="ticker-badge">Breaking</div>
      <div class="ticker-track">
        <div class="ticker-content"></div>
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

export default class TickerGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.ticker');
    this._badge = this.querySelector('.ticker-badge');
    this._content = this.querySelector('.ticker-content');
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  _renderItems(items) {
    // Render the headlines twice, each followed by its separator, so the two
    // halves are identical. Moving -50% then lands the second copy exactly
    // where the first started, and the loop restarts without a jump.
    const oneSet = items.map((item) =>
      `<span class="ticker-item"><span class="ticker-dot"></span>${escapeHtml(item)}</span>` +
      '<span class="ticker-separator"></span>'
    ).join('');
    this._content.innerHTML = oneSet + oneSet;
  }

  _applyPlayMode(loop) {
    if (!this._content) return;
    this._content.style.animationIterationCount = loop === false ? '1' : 'infinite';
    this._content.style.animationFillMode = loop === false ? 'forwards' : '';
  }

  _applyData(data) {
    if (!data) return;
    if (data.badge !== undefined) this._badge.textContent = data.badge;
    if (Array.isArray(data.items)) this._renderItems(data.items);
    if ('loop' in data) this._applyPlayMode(data.loop);
  }

  async load({ data } = {}) {
    this._initDom();
    this._applyData(data);
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
    await sleep(500);
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
    this._applyData(data);
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
