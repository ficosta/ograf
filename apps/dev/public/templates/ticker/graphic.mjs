export default class TickerGraphic extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="ticker">
        <div class="ticker-bar">
          <div class="ticker-badge">Breaking</div>
          <div class="ticker-track">
            <div class="ticker-content"></div>
          </div>
        </div>
      </div>
    `;
    this._root = this.querySelector('.ticker');
    this._badge = this.querySelector('.ticker-badge');
    this._content = this.querySelector('.ticker-content');
  }

  _renderItems(items) {
    // Duplicate items for seamless loop
    const allItems = [...items, ...items];
    this._content.innerHTML = allItems.map((item, i) =>
      `<span class="ticker-item"><span class="ticker-dot"></span>${item}</span>` +
      (i < allItems.length - 1 ? '<span class="ticker-separator"></span>' : '')
    ).join('');
  }

  _applyPlayMode(loop) {
    if (!this._content) return;
    this._content.style.animationIterationCount = loop === false ? '1' : 'infinite';
    this._content.style.animationFillMode = loop === false ? 'forwards' : '';
  }

  async load({ data }) {
    if (data?.badge) this._badge.textContent = data.badge;
    if (data?.items) this._renderItems(data.items);
    this._applyPlayMode(data?.loop);
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
    await new Promise(r => setTimeout(r, 500));
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
    if (data?.badge) this._badge.textContent = data.badge;
    if (data?.items) this._renderItems(data.items);
    if (data && 'loop' in data) this._applyPlayMode(data.loop);
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
