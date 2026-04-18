export default class QuoteGraphic extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="quote">
        <div class="quote-bg"></div>
        <div class="quote-content">
          <div class="quote-mark">"</div>
          <div class="quote-text"></div>
          <div class="quote-line"></div>
          <div class="quote-attr">
            <div class="quote-author"></div>
            <div class="quote-role"></div>
          </div>
        </div>
      </div>
    `;
    this._root = this.querySelector('.quote');
    this._text = this.querySelector('.quote-text');
    this._author = this.querySelector('.quote-author');
    this._role = this.querySelector('.quote-role');
  }

  async load({ data }) {
    if (data?.text) this._text.textContent = data.text;
    if (data?.author) this._author.textContent = data.author;
    if (data?.role) this._role.textContent = data.role;
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
    await new Promise(r => setTimeout(r, 1200));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    if (data?.text) this._text.textContent = data.text;
    if (data?.author) this._author.textContent = data.author;
    if (data?.role) this._role.textContent = data.role;
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
