/**
 * OGraf Lower Third — CBS-inspired clean design
 *
 * Implements the OGraf v1 Web Component lifecycle:
 *   load / playAction / updateAction / stopAction / customAction / dispose
 *
 * DOM initialisation happens in load() (not connectedCallback) because real
 * OGraf players create the element with document.createElement() and call
 * load() on a detached element — connectedCallback never fires in that path.
 * Do NOT call customElements.define() from this module; the renderer picks
 * the tag and registers the class itself.
 */
export default class LowerThird extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = `
      <div class="l3rd">
        <div class="l3rd-accent"></div>
        <div class="l3rd-content">
          <div class="l3rd-name"></div>
          <div class="l3rd-title"></div>
        </div>
      </div>
    `;
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

    await new Promise(resolve => setTimeout(resolve, 350));
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
