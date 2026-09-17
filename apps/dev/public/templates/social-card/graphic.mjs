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
  <div class="social-card-root">
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
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  _getInitials(name) {
    if (!name) return '';
    return String(name).split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  _applyData(data) {
    if (!data) return;
    if (data.user !== undefined) {
      this._userName.textContent = data.user;
      this._initials.textContent = this._getInitials(data.user);
    }
    if (data.handle !== undefined) this._handle.textContent = data.handle;
    if (data.text !== undefined) this._text.textContent = data.text;
    if (data.platform !== undefined) this._platform.textContent = data.platform;
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
    await sleep(700);
    return { statusCode: 200, currentStep: this._step };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
    return { statusCode: 200 };
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
