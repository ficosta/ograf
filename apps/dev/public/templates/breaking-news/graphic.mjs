
  /**
   * customAction() — No customActions are declared in the manifest for this
   * graphic, but every OGraf graphic must implement this method. It's a no-op
   * that reports the action as unknown.
   */
  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }
/**
 * OGraf Breaking News Alert — Full-screen urgent overlay
 *
 * A fire-and-forget breaking news alert that auto-dismisses
 * after a hold period. Implements the full OGraf Web Component lifecycle.
 */
export default class BreakingNews extends HTMLElement {

  connectedCallback() {
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
  }

  /**
   * load() — Receive initial data.
   */
  async load({ data }) {
    if (data?.headline) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  /**
   * playAction() — Animate in, hold for 4 seconds, then auto-dismiss.
   */
  async playAction({ delta = 1, goto, skipAnimation } = {}) {
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

  /**
   * stopAction() — Force stop the alert early.
   */
  async stopAction({ skipAnimation } = {}) {
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

  /**
   * updateAction() — Update headline text.
   */
  async updateAction({ data }) {
    if (data?.headline) this._headline.textContent = data.headline;
    return { statusCode: 200 };
  }

  /**
   * dispose() — Clean up resources.
   */
  async dispose() {
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}
