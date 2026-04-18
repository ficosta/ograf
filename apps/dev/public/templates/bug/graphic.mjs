export default class BugGraphic extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
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
    this._root = this.querySelector('.bug');
    this._label = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
  }

  async load({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
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
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
    return { statusCode: 200 };
  }
  /**
   * customAction() — No customActions are declared in the manifest for this
   * graphic, but every OGraf graphic must implement this method. It's a no-op
   * that reports the action as unknown.
   */
  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }


  async dispose() {
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}
