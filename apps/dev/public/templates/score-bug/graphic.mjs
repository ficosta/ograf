/**
 * OGraf Score Bug — persistent sports score display with a `goal` customAction.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define() here;
 * the renderer picks the tag.
 */
export default class ScoreBug extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
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
    this._homeTeam = this.querySelector('.home');
    this._awayTeam = this.querySelector('.away');
    this._step = undefined;
    this._initialized = true;
  }

  _updateActiveTeam(data) {
    if (!data) return;
    this._homeTeam.classList.remove('active');
    this._awayTeam.classList.remove('active');
    if (data.homeScore > data.awayScore) this._homeTeam.classList.add('active');
    else if (data.awayScore > data.homeScore) this._awayTeam.classList.add('active');
  }

  _applyData(data) {
    if (!data) return;
    if (data.home) this._homeName.textContent = data.home;
    if (data.away) this._awayName.textContent = data.away;
    if (data.homeScore !== undefined) this._homeScore.textContent = data.homeScore;
    if (data.awayScore !== undefined) this._awayScore.textContent = data.awayScore;
    if (data.time) this._time.textContent = data.time;
    if (data.period) this._period.textContent = data.period;
    this._updateActiveTeam(data);
  }

  async load({ data } = {}) {
    this._initDom();
    this._applyData(data);
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
    await new Promise(resolve => setTimeout(resolve, 600));
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
    await new Promise(resolve => setTimeout(resolve, 400));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
    return { statusCode: 200 };
  }

  async updateAction({ data, skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._applyData(data);
      return { statusCode: 200 };
    }

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

  async customAction({ action } = {}) {
    this._initDom();
    if (action === 'goal') {
      this._root.classList.add('goal');
      await new Promise(resolve => setTimeout(resolve, 800));
      this._root.classList.remove('goal');
      return { statusCode: 200 };
    }
    return { statusCode: 404, description: `Unknown custom action: ${action ?? ""}` };
  }

  async dispose() {
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
