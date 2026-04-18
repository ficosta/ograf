/**
 * OGraf Social Media Card — post overlay with auto-generated avatar initials.
 *
 * DOM init is lazy (see _initDom). Real OGraf players drive the lifecycle on
 * detached elements, so we cannot depend on connectedCallback firing. Do NOT
 * call customElements.define() here.
 */
export default class SocialCard extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = `
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
    this._root = this.querySelector('.social');
    this._initials = this.querySelector('.social-avatar-initials');
    this._userName = this.querySelector('.social-user-name');
    this._handle = this.querySelector('.social-user-handle');
    this._platform = this.querySelector('.social-platform');
    this._text = this.querySelector('.social-text');
    this._step = undefined;
    this._initialized = true;
  }

  _getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
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

  async playAction({ delta = 1, goto, skipAnimation } = {}) {
    this._initDom();
    const target = goto !== undefined ? goto : (this._step === undefined ? -1 : this._step) + delta;
    this._step = target;

    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: this._step };
    }

    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(resolve => setTimeout(resolve, 700));
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
    await new Promise(resolve => setTimeout(resolve, 500));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
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
