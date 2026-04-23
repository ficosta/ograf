/**
 * OGraf Breaking News Alert — full-screen urgent overlay.
 *
 * Fire-and-forget: plays in, holds ~4s, auto-dismisses. Manifest sets
 * stepCount: 0 so the renderer expects the graphic to run its full
 * lifecycle from a single playAction call.
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
`;

export default class BreakingNewsGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.breaking');
    this._headline = this.querySelector('.breaking-headline');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.headline) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: 0 };
    }

    void this._root.offsetWidth;
    this._root.classList.add('visible');

    await new Promise(r => setTimeout(r, 4700));

    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 600));
    this._root.classList.remove('visible', 'out');

    return { statusCode: 200, currentStep: 0 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.headline) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 600));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
