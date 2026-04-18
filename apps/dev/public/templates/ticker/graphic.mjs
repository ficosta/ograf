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

export default class TickerGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.ticker');
    this._badge = this.querySelector('.ticker-badge');
    this._content = this.querySelector('.ticker-content');
    this._initialized = true;
  }

  _renderItems(items) {
    // Duplicate items so the scrolling loop is seamless. When the animation
    // finishes moving -50% it has replaced the first set with the second.
    const allItems = [...items, ...items];
    this._content.innerHTML = allItems.map((item, i) =>
      `<span class="ticker-item"><span class="ticker-dot"></span>${escapeHtml(item)}</span>` +
      (i < allItems.length - 1 ? '<span class="ticker-separator"></span>' : '')
    ).join('');
  }

  _applyPlayMode(loop) {
    if (!this._content) return;
    this._content.style.animationIterationCount = loop === false ? '1' : 'infinite';
    this._content.style.animationFillMode = loop === false ? 'forwards' : '';
  }

  _applyData(data) {
    if (!data) return;
    if (data.badge) this._badge.textContent = data.badge;
    if (Array.isArray(data.items)) this._renderItems(data.items);
    if ('loop' in data) this._applyPlayMode(data.loop);
  }

  async load({ data } = {}) {
    this._initDom();
    this._applyData(data);
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
    await new Promise(r => setTimeout(r, 500));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
