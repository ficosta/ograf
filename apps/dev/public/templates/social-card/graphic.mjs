/**
 * OGraf Social Media Card — post overlay with auto-generated avatar initials.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag whose URL is computed from import.meta.url,
 * so it resolves wherever the renderer serves the package from.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define()
 * here — the renderer picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="social">
    <div class="social-card">
      <div class="social-header">
        <div class="social-avatar">
          <span class="social-avatar-initials"></span>
        </div>
        <div class="social-user-info">
          <div class="social-user-name"></div>
          <div class="social-user-handle"></div>
        </div>
        <div class="social-platform"></div>
      </div>
      <div class="social-text"></div>
    </div>
  </div>
`;

export default class SocialCardGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.social');
    this._initials = this.querySelector('.social-avatar-initials');
    this._userName = this.querySelector('.social-user-name');
    this._handle = this.querySelector('.social-user-handle');
    this._platform = this.querySelector('.social-platform');
    this._text = this.querySelector('.social-text');
    this._initialized = true;
  }

  _getInitials(name) {
    if (!name) return '';
    return String(name).split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  _applyData(data) {
    if (!data) return;
    if (data.user) {
      this._userName.textContent = data.user;
      this._initials.textContent = this._getInitials(data.user);
    }
    if (data.handle) this._handle.textContent = data.handle;
    if (data.text) this._text.textContent = data.text;
    if (data.platform) this._platform.textContent = data.platform;
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
    await new Promise(r => setTimeout(r, 700));
    return { statusCode: 200, currentStep: 0 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
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
