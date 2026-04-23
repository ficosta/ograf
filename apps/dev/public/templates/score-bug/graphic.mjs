/**
 * OGraf Score Bug — persistent sports scoreboard with a "goal" custom action.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag whose URL is computed from import.meta.url,
 * so it resolves wherever the renderer serves the package from.
 *
 * customAction("goal") triggers a brief flash without advancing the
 * graphic's step. Unknown actions MUST return statusCode 404 — that's
 * how a compliant renderer learns the action is unsupported.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define()
 * here — the renderer picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
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

export default class ScoreBugGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.score-bug');
    this._homeName = this.querySelector('.home-name');
    this._awayName = this.querySelector('.away-name');
    this._homeScore = this.querySelector('.home-score');
    this._awayScore = this.querySelector('.away-score');
    this._time = this.querySelector('.score-time');
    this._period = this.querySelector('.score-period');
    this._initialized = true;
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

  _updateActiveTeam(data) {
    const homeTeam = this.querySelector('.home');
    const awayTeam = this.querySelector('.away');
    homeTeam.classList.remove('active');
    awayTeam.classList.remove('active');
    const h = Number(data?.homeScore);
    const a = Number(data?.awayScore);
    if (!Number.isNaN(h) && !Number.isNaN(a)) {
      if (h > a) homeTeam.classList.add('active');
      else if (a > h) awayTeam.classList.add('active');
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
      return { statusCode: 200, currentStep: 0 };
    }
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await new Promise(r => setTimeout(r, 600));
    return { statusCode: 200, currentStep: 0 };
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
    await new Promise(r => setTimeout(r, 350));
    return { statusCode: 200 };
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

  async customAction({ action } = {}) {
    this._initDom();
    if (action === 'goal') {
      this._root.classList.add('goal');
      await new Promise(r => setTimeout(r, 800));
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
