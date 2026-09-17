/**
 * OGraf Breaking News Alert — full-screen urgent overlay.
 *
 * Fire-and-forget: plays in (1.2s), holds 3.5s, auto-dismisses. Manifest
 * sets stepCount: 0 so a single playAction runs the whole lifecycle; the
 * promise resolves once the entrance lands and the rest runs in the background.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via
 * a <link rel="stylesheet"> whose URL is computed from import.meta.url,
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
  <div class="breaking-news-root">
  <div class="breaking">
    <div class="breaking-overlay"></div>
    <div class="breaking-content">
      <div class="breaking-badge">
        <span class="breaking-badge-dot"></span>
        <span class="breaking-badge-text">Breaking News</span>
      </div>
      <div class="breaking-headline"></div>
      <div class="breaking-line"></div>
    </div>
  </div>
  </div>
`;

// In: the staggered reveal ends when the accent line lands (0.6s delay + 0.6s
// transition). Hold: time on air. Out: the 0.6s fade.
const IN_MS = 1200;
const HOLD_MS = 3500;
const OUT_MS = 600;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default class BreakingNewsGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.breaking');
    this._headline = this.querySelector('.breaking-headline');
    this._rev = 0;
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.headline !== undefined) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  // Each action takes the next revision number. Anything that finishes after a
  // newer action has started checks it and backs off, so play → stop → play
  // sent without waiting ends on air instead of hidden by the stale stop.
  async playAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('instant');
    } else {
      this._root.classList.remove('instant');
      void this._root.offsetWidth;
    }
    this._root.classList.add('visible');

    // stepCount is 0: the graphic runs start → end on its own. The promise
    // resolves once it is on screen, so the renderer is free for the next
    // action; the hold and the exit carry on in the background.
    if (!skipAnimation) await sleep(IN_MS);
    this._autoDismiss(rev, skipAnimation);
    return { statusCode: 200, currentStep: undefined };
  }

  async _autoDismiss(rev, skipAnimation) {
    await sleep(HOLD_MS);
    if (rev !== this._rev) return;
    if (skipAnimation) {
      this._root.classList.remove('visible', 'out');
      return;
    }
    this._root.classList.add('out');
    await sleep(OUT_MS);
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.headline !== undefined) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    if (skipAnimation) {
      this._root.classList.add('instant');
      this._root.classList.remove('visible', 'out');
      return { statusCode: 200 };
    }
    this._root.classList.remove('instant');
    this._root.classList.add('out');
    await sleep(600);
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
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
