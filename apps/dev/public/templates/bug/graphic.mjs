/**
 * OGraf Bug / LIVE — corner indicator with a pulsing dot.
 *
 * Self-contained: the component carries its own styles inside a <style>
 * tag in its innerHTML, and the Inter font files are shipped alongside
 * graphic.mjs in ./fonts/. This is the only pattern that works inside a
 * real OGraf player's Shadow DOM, since the player isolates styles and
 * never loads any external style.css.
 *
 * Font URLs are resolved from import.meta.url so they work regardless of
 * where the package is served from.
 *
 * Do NOT call customElements.define() here -- the renderer picks the tag.
 */

const FONT_SEMI_BOLD = new URL('./fonts/Inter-SemiBold.woff2', import.meta.url).href;
const FONT_EXTRA_BOLD = new URL('./fonts/Inter-ExtraBold.woff2', import.meta.url).href;

const TEMPLATE = `
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('${FONT_SEMI_BOLD}') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 800;
      font-display: swap;
      src: url('${FONT_EXTRA_BOLD}') format('woff2');
    }

    bug-graphic, bug-graphic * { margin: 0; padding: 0; box-sizing: border-box; }

    .bug {
      position: absolute;
      top: 40px;
      right: 40px;
      font-family: 'Inter', sans-serif;
      transform: scale(0.5);
      opacity: 0;
      filter: blur(8px);
    }

    .bug.visible {
      transform: scale(1);
      opacity: 1;
      filter: blur(0);
      transition:
        transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
        opacity 0.4s ease,
        filter 0.4s ease;
    }

    .bug.out {
      transform: scale(0.8);
      opacity: 0;
      filter: blur(8px);
      transition:
        transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
        opacity 0.3s ease,
        filter 0.3s ease;
    }

    .bug-container {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 14px 22px 14px 16px;
      border-radius: 14px;
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.1),
        0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .bug-live {
      position: relative;
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    .bug-live-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ef4444;
    }

    .bug-live-ping {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: #ef4444;
      animation: live-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes live-ping {
      0%   { transform: scale(1);   opacity: 0.6; }
      75%, 100% { transform: scale(1.8); opacity: 0; }
    }

    .bug-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .bug-label {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1;
    }

    .bug-sublabel {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: 2px;
    }
  </style>
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

export default class BugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.bug');
    this._label = this.querySelector('.bug-label');
    this._sublabel = this.querySelector('.bug-sublabel');
    this._initialized = true;
  }

  async load({ data } = {}) {
    this._initDom();
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
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
    await new Promise(r => setTimeout(r, 600));
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.label) this._label.textContent = data.label;
    if (data?.sublabel) this._sublabel.textContent = data.sublabel;
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
