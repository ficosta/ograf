/**
 * OGraf Full Page Quote — cinematic full-screen quote card.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define() here;
 * the renderer picks the tag.
 */
export default class QuoteGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
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
    this._initialized = true;
  }

  _applyData(data) {
    if (!data) return;
    if (data.text) this._text.textContent = data.text;
    if (data.author) this._author.textContent = data.author;
    if (data.role) this._role.textContent = data.role;
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
    await new Promise(r => setTimeout(r, 1200));
    return { statusCode: 200, currentStep: 0 };
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
