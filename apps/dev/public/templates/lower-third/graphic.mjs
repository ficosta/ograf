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

export default class LowerThird extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.l3rd');
    this._name = this.querySelector('.l3rd-name');
    this._title = this.querySelector('.l3rd-title');
    this._step = undefined;
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.name) this._name.textContent = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  async playAction({ delta = 1, goto, skipAnimation } = {}) {
    this._initDom();
    const target = goto !== undefined ? goto : (this._step === undefined ? -1 : this._step) + delta;
    this._step = target;

    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: this._step };
    }

    // Force a reflow so the browser registers the starting state.
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 700));
    return { statusCode: 200, currentStep: this._step };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      this._step = undefined;
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
    return { statusCode: 200 };
  }

  async updateAction({ data, skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      if (data?.name) this._name.textContent = data.name;
      if (data?.title) this._title.textContent = data.title;
      return { statusCode: 200 };
    }

    if (data?.name && data.name !== this._name.textContent) {
      this._name.classList.add('updating');
      setTimeout(() => { this._name.textContent = data.name; }, 140);
      setTimeout(() => { this._name.classList.remove('updating'); }, 350);
    }

    if (data?.title && data.title !== this._title.textContent) {
      this._title.classList.add('updating');
      setTimeout(() => { this._title.textContent = data.title; }, 140);
      setTimeout(() => { this._title.classList.remove('updating'); }, 350);
    }

    await new Promise(r => setTimeout(r, 350));
    return { statusCode: 200 };
  }

  // Every OGraf graphic must expose customAction, even without any declared.
  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
