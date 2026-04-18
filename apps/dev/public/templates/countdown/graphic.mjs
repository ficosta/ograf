
  /**
   * customAction() — No customActions are declared in the manifest for this
   * graphic, but every OGraf graphic must implement this method. It's a no-op
   * that reports the action as unknown.
   */
  async customAction({ action } = {}) {
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }
/**
 * OGraf Countdown Timer — CBS-inspired centered countdown
 *
 * A production-ready countdown timer that ticks in real-time
 * using setInterval, implementing the full OGraf Web Component lifecycle.
 */
export default class CountdownTimer extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="countdown">
        <div class="countdown-card">
          <div class="countdown-label"></div>
          <div class="countdown-time">
            <span class="countdown-mins"></span><span class="countdown-sep">:</span><span class="countdown-secs"></span>
          </div>
        </div>
      </div>
    `;
    this._root = this.querySelector('.countdown');
    this._label = this.querySelector('.countdown-label');
    this._time = this.querySelector('.countdown-time');
    this._mins = this.querySelector('.countdown-mins');
    this._secs = this.querySelector('.countdown-secs');
    this._interval = null;
    this._remaining = 0;
    this._step = undefined;
  }

  _paintTime(totalSeconds, { animate } = {}) {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');

    if (this._mins.textContent !== mins) {
      this._swap(this._mins, mins, animate);
    }
    if (this._secs.textContent !== secs) {
      this._swap(this._secs, secs, animate);
    }
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

      if (this._remaining <= 10) {
        this._root.classList.add('urgent');
      } else {
        this._root.classList.remove('urgent');
      }
    }, 1000);
  }

  _stopTicking() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  /**
   * load() — Receive initial data and render context.
   */
  async load({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.seconds !== undefined) {
      this._remaining = data.seconds;
      this._paintTime(this._remaining);
    }
    return { statusCode: 200 };
  }

  /**
   * playAction() — Animate the countdown onto screen and start ticking.
   */
  async playAction({ delta = 1, goto, skipAnimation } = {}) {
    const target = goto !== undefined ? goto : (this._step === undefined ? -1 : this._step) + delta;
    this._step = target;

    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      this._startTicking();
      return { statusCode: 200, currentStep: this._step };
    }

    void this._root.offsetWidth;
    this._root.classList.add('visible');

    await new Promise(resolve => setTimeout(resolve, 800));
    this._startTicking();
    return { statusCode: 200, currentStep: this._step };
  }

  /**
   * stopAction() — Stop ticking and animate the countdown off screen.
   */
  async stopAction({ skipAnimation } = {}) {
    this._stopTicking();

    if (skipAnimation) {
      this._root.classList.remove('visible');
      this._step = undefined;
      return { statusCode: 200 };
    }

    this._root.classList.add('out');
    await new Promise(resolve => setTimeout(resolve, 500));
    this._root.classList.remove('visible', 'out', 'urgent');
    this._step = undefined;
    return { statusCode: 200 };
  }

  /**
   * updateAction() — Update data while on-air (e.g., reset time).
   */
  async updateAction({ data }) {
    if (data?.label) this._label.textContent = data.label;
    if (data?.seconds !== undefined) {
      this._remaining = data.seconds;
      this._paintTime(this._remaining);
      this._root.classList.remove('urgent');
    }
    return { statusCode: 200 };
  }

  /**
   * dispose() — Clean up resources.
   */
  async dispose() {
    this._stopTicking();
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}
