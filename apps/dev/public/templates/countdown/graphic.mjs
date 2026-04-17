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
          <div class="countdown-time"></div>
        </div>
      </div>
    `;
    this._root = this.querySelector('.countdown');
    this._label = this.querySelector('.countdown-label');
    this._time = this.querySelector('.countdown-time');
    this._interval = null;
    this._remaining = 0;
    this._step = undefined;
  }

  _formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  _startTicking() {
    this._stopTicking();
    this._interval = setInterval(() => {
      if (this._remaining <= 0) {
        this._stopTicking();
        return;
      }
      this._remaining--;
      this._time.textContent = this._formatTime(this._remaining);

      // Tick animation
      this._time.classList.remove('tick');
      void this._time.offsetWidth;
      this._time.classList.add('tick');

      // Urgent mode for last 10 seconds
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
      this._time.textContent = this._formatTime(this._remaining);
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
      this._time.textContent = this._formatTime(this._remaining);
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

customElements.define('countdown-timer', CountdownTimer);
