/**
 * OGraf Countdown Timer — self-ticking clock that goes red in the last 10s.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag whose URL is computed from import.meta.url,
 * so it resolves wherever the renderer serves the package from.
 *
 * DOM init is lazy (see _initDom). The interval is cleared in stopAction
 * AND dispose — forgetting either means ghost timers ticking in the
 * background. Do NOT call customElements.define() here — the renderer
 * picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="countdown">
    <div class="countdown-card">
      <div class="countdown-label"></div>
      <div class="countdown-time">
        <span class="countdown-mins"></span><span class="countdown-sep">:</span><span class="countdown-secs"></span>
      </div>
    </div>
  </div>
`;

export default class CountdownGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.countdown');
    this._label = this.querySelector('.countdown-label');
    this._mins = this.querySelector('.countdown-mins');
    this._secs = this.querySelector('.countdown-secs');
    this._interval = null;
    this._remaining = 0;
    this._initialized = true;
  }

  _paintTime(totalSeconds, { animate } = {}) {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    if (this._mins.textContent !== mins) this._swap(this._mins, mins, animate);
    if (this._secs.textContent !== secs) this._swap(this._secs, secs, animate);
  }

  _swap(el, next, animate) {
    if (!animate) {
      el.textContent = next;
      return;
    }
    el.classList.remove('tick');
    void el.offsetWidth;
    el.textContent = next;
    el.classList.add('tick');
  }

  _startTicking() {
    this._stopTicking();
    this._interval = setInterval(() => {
      if (this._remaining <= 0) {
        this._stopTicking();
        return;
      }
      this._remaining--;
      this._paintTime(this._remaining, { animate: true });
      if (this._remaining <= 10) this._root.classList.add('urgent');
      else this._root.classList.remove('urgent');
    }, 1000);
  }

  _stopTicking() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _applyData(data) {
    if (!data) return;
    if (data.label) this._label.textContent = data.label;
    if (data.seconds !== undefined) {
      this._remaining = Number(data.seconds);
      this._paintTime(this._remaining);
    }
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
      this._startTicking();
      return { statusCode: 200, currentStep: 0 };
    }
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 800));
    this._startTicking();
    return { statusCode: 200, currentStep: 0 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    const wasTicking = this._interval !== null;
    this._applyData(data);
    if (data?.seconds !== undefined) this._root.classList.remove('urgent');
    if (wasTicking) this._startTicking();
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    this._stopTicking();
    if (skipAnimation) {
      this._root.classList.remove('visible', 'urgent');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
    this._root.classList.remove('visible', 'out', 'urgent');
    return { statusCode: 200 };
  }

  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }

  async dispose() {
    this._stopTicking();
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
