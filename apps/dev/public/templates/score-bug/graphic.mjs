/**
 * OGraf Score Bug — CBS-inspired persistent sports score display
 *
 * A production-ready score bug graphic implementing
 * the full OGraf Web Component lifecycle.
 * Supports customActions: "goal" (flash animation).
 */
export default class ScoreBug extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <div class="score-bug">
        <div class="score-bug-inner">
          <div class="score-team home">
            <span class="score-team-name home-name"></span>
            <span class="score-value home-score"></span>
          </div>
          <div class="score-center">
            <div class="score-time"></div>
            <div class="score-period"></div>
          </div>
          <div class="score-team away">
            <span class="score-value away-score"></span>
            <span class="score-team-name away-name"></span>
          </div>
        </div>
      </div>
    `;
    this._root = this.querySelector('.score-bug');
    this._homeName = this.querySelector('.home-name');
    this._awayName = this.querySelector('.away-name');
    this._homeScore = this.querySelector('.home-score');
    this._awayScore = this.querySelector('.away-score');
    this._time = this.querySelector('.score-time');
    this._period = this.querySelector('.score-period');
    this._step = undefined;
  }

  /**
   * load() — Receive initial data and render context.
   */
  async load({ data }) {
    if (data?.home) this._homeName.textContent = data.home;
    if (data?.away) this._awayName.textContent = data.away;
    if (data?.homeScore !== undefined) this._homeScore.textContent = data.homeScore;
    if (data?.awayScore !== undefined) this._awayScore.textContent = data.awayScore;
    if (data?.time) this._time.textContent = data.time;
    if (data?.period) this._period.textContent = data.period;

    this._updateActiveTeam(data);
    return { statusCode: 200 };
  }

  _updateActiveTeam(data) {
    const homeTeam = this.querySelector('.home');
    const awayTeam = this.querySelector('.away');
    homeTeam.classList.remove('active');
    awayTeam.classList.remove('active');
    if (data?.homeScore > data?.awayScore) {
      homeTeam.classList.add('active');
    } else if (data?.awayScore > data?.homeScore) {
      awayTeam.classList.add('active');
    }
  }

  /**
   * playAction() — Animate the score bug onto screen.
   */
  async playAction({ delta = 1, goto, skipAnimation } = {}) {
    const target = goto !== undefined ? goto : (this._step === undefined ? -1 : this._step) + delta;
    this._step = target;

    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('visible');
      return { statusCode: 200, currentStep: this._step };
    }

    void this._root.offsetWidth;
    this._root.classList.add('visible');

    await new Promise(resolve => setTimeout(resolve, 600));
    return { statusCode: 200, currentStep: this._step };
  }

  /**
   * stopAction() — Animate the score bug off screen.
   */
  async stopAction({ skipAnimation } = {}) {
    if (skipAnimation) {
      this._root.classList.remove('visible');
      this._step = undefined;
      return { statusCode: 200 };
    }

    this._root.classList.add('out');
    await new Promise(resolve => setTimeout(resolve, 400));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
    return { statusCode: 200 };
  }

  /**
   * updateAction() — Update score data while on-air.
   */
  async updateAction({ data, skipAnimation } = {}) {
    if (skipAnimation) {
      if (data?.home) this._homeName.textContent = data.home;
      if (data?.away) this._awayName.textContent = data.away;
      if (data?.homeScore !== undefined) this._homeScore.textContent = data.homeScore;
      if (data?.awayScore !== undefined) this._awayScore.textContent = data.awayScore;
      if (data?.time) this._time.textContent = data.time;
      if (data?.period) this._period.textContent = data.period;
      this._updateActiveTeam(data);
      return { statusCode: 200 };
    }

    // Animate score changes
    if (data?.homeScore !== undefined && String(data.homeScore) !== this._homeScore.textContent) {
      this._homeScore.classList.add('updating');
      setTimeout(() => { this._homeScore.textContent = data.homeScore; }, 140);
      setTimeout(() => { this._homeScore.classList.remove('updating'); }, 350);
    }

    if (data?.awayScore !== undefined && String(data.awayScore) !== this._awayScore.textContent) {
      this._awayScore.classList.add('updating');
      setTimeout(() => { this._awayScore.textContent = data.awayScore; }, 140);
      setTimeout(() => { this._awayScore.classList.remove('updating'); }, 350);
    }

    if (data?.time) this._time.textContent = data.time;
    if (data?.period) this._period.textContent = data.period;
    if (data?.home) this._homeName.textContent = data.home;
    if (data?.away) this._awayName.textContent = data.away;

    this._updateActiveTeam(data);
    await new Promise(resolve => setTimeout(resolve, 350));
    return { statusCode: 200 };
  }

  /**
   * customAction() — Handle custom actions like "goal".
   */
  async customAction({ action } = {}) {
    if (action === 'goal') {
      this._root.classList.add('goal');
      await new Promise(resolve => setTimeout(resolve, 800));
      this._root.classList.remove('goal');
    }
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
