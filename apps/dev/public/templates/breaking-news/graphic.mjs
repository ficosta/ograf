/**
 * OGraf Breaking News Alert — Full-screen urgent overlay.
 *
 * Fire-and-forget: plays in, holds, and auto-dismisses.
 * Implements the full OGraf v1 Web Component lifecycle with DOM init in
 * load() so detached-element tests from a real player (ograf-devtool etc.)
 * succeed. Do NOT call customElements.define() here; the renderer picks
 * the tag.
 */
export default class BreakingNews extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = `
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
    this._root = this.querySelector('.breaking');
    this._headline = this.querySelector('.breaking-headline');
    this._step = undefined;
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.headline) this._headline.textContent = data.headline;
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

    // Wait for in-animation (700ms) + hold (4000ms)
    await new Promise(resolve => setTimeout(resolve, 4700));

    // Auto-dismiss
    this._root.classList.add('out');
    await new Promise(resolve => setTimeout(resolve, 600));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;

    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      this._step = undefined;
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(resolve => setTimeout(resolve, 600));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.headline) this._headline.textContent = data.headline;
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
