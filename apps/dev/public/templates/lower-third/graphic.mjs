/**
 * OGraf Lower Third — CBS-inspired clean design
 *
 * A production-ready lower third graphic implementing
 * the full OGraf Web Component lifecycle.
 */
export default class LowerThird extends HTMLElement {

  connectedCallback() {
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
  }

  /**
   * load() — Receive initial data and render context.
   * Called once when the graphic is first loaded.
   */
  async load({ data }) {
    if (data?.name) this._name.textContent = data.name;
    if (data?.title) this._title.textContent = data.title;
    return { statusCode: 200 };
  }

  /**
   * playAction() — Animate the graphic onto screen.
   * Returns a Promise that resolves when the animation is complete.
   */
  async playAction({ delta = 1, goto, skipAnimation } = {}) {
    // Calculate target step
    const target = goto !== undefined ? goto : (this._step === undefined ? -1 : this._step) + delta;
    this._step = target;

    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: this._step };
    }

    // Trigger the CSS transition
    // Force a reflow so the browser registers the starting state
    void this._root.offsetWidth;
    this._root.classList.add('visible');

    // Wait for the animation to complete (700ms matches CSS)
    await new Promise(resolve => setTimeout(resolve, 700));

    return { statusCode: 200, currentStep: this._step };
  }

  /**
   * stopAction() — Animate the graphic off screen.
   * Returns a Promise that resolves when the out-animation is complete.
   */
  async stopAction({ skipAnimation } = {}) {
    if (skipAnimation) {
      this._root.classList.remove('visible');
      this._step = undefined;
      return { statusCode: 200 };
    }

    this._root.classList.add('out');

    // Wait for the out-animation (500ms matches CSS)
    await new Promise(resolve => setTimeout(resolve, 500));

    this._root.classList.remove('visible', 'out');
    this._step = undefined;

    return { statusCode: 200 };
  }

  /**
   * updateAction() — Update data while the graphic is on-air.
   * Smoothly transitions the text content.
   */
  async updateAction({ data, skipAnimation } = {}) {
    if (skipAnimation) {
      if (data?.name) this._name.textContent = data.name;
      if (data?.title) this._title.textContent = data.title;
      return { statusCode: 200 };
    }

    // Animate the text swap
    if (data?.name && data.name !== this._name.textContent) {
      this._name.classList.add('updating');
      setTimeout(() => {
        this._name.textContent = data.name;
      }, 140); // Swap at the midpoint of the animation
      setTimeout(() => {
        this._name.classList.remove('updating');
      }, 350);
    }

    if (data?.title && data.title !== this._title.textContent) {
      this._title.classList.add('updating');
      setTimeout(() => {
        this._title.textContent = data.title;
      }, 140);
      setTimeout(() => {
        this._title.classList.remove('updating');
      }, 350);
    }

    await new Promise(resolve => setTimeout(resolve, 350));
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

// Register the Custom Element
customElements.define('lower-third', LowerThird);
