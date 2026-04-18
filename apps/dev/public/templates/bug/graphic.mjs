/**
 * OGraf Bug / LIVE — corner indicator with a pulsing LIVE dot.
 *
 * Designed for the OGraf iframe mount model: the renderer instantiates the
 * graphic inside its own document, so we load our stylesheet with a plain
 * <link> tag and keep all styling in style.css. URLs inside style.css (for
 * fonts, images, etc.) resolve relative to style.css's own location, which
 * is exactly what we want for ./fonts/Inter-*.woff2.
 *
 * style.css is referenced via an absolute URL computed from import.meta.url
 * so it resolves wherever the package is served from.
 *
 * DOM init is done lazily in load() rather than connectedCallback: renderers
 * may instantiate the element without immediately inserting it, and load()
 * is always the first method called. _initialized guards against re-entry.
 *
 * Do NOT call customElements.define() here -- the renderer picks the tag.
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

export default class BugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.bug');
    this._label = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
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
    await new Promise(r => setTimeout(r, 600));
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
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
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
