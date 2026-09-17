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
  <div class="score-bug-root">
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
  </div>
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The step a playAction() lands on, exactly as the spec defines it: `goto`
 * wins; otherwise the current step (-1 before the first play) plus `delta`,
 * which defaults to 1. A target at or past stepCount means "go to the end",
 * returned as undefined — so a second play on a one-step graphic takes it off
 * air instead of replaying it.
 */
function resolveTargetStep(currentStep, { goto, delta } = {}, stepCount = 1) {
  const target = Number.isInteger(goto) && goto >= 0
    ? goto
    : (currentStep ?? -1) + (Number.isInteger(delta) ? delta : 1);
  return target >= stepCount ? undefined : Math.max(target, 0);
}

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
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  _applyData(data) {
    if (!data) return;
    if (data.home !== undefined) this._homeName.textContent = data.home;
    if (data.away !== undefined) this._awayName.textContent = data.away;
    if (data.homeScore !== undefined) this._homeScore.textContent = data.homeScore;
    if (data.awayScore !== undefined) this._awayScore.textContent = data.awayScore;
    if (data.time !== undefined) this._time.textContent = data.time;
    if (data.period !== undefined) this._period.textContent = data.period;
    this._updateActiveTeam(data);
  }

  _updateActiveTeam(data) {
    const homeTeam = this.querySelector('.home');
    const awayTeam = this.querySelector('.away');
    homeTeam.classList.remove('active');
    awayTeam.classList.remove('active');
    // A partial update may carry only one score, or none: fall back to what is
    // on screen so the leader's highlight survives a clock-only update.
    const h = Number(data?.homeScore ?? this._homeScore.textContent);
    const a = Number(data?.awayScore ?? this._awayScore.textContent);
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

  // Each action takes the next revision number. Anything that finishes after a
  // newer action has started checks it and backs off, so play → stop → play
  // sent without waiting ends on air instead of hidden by the stale stop.
  async playAction({ goto, delta, skipAnimation } = {}) {
    this._initDom();
    const target = resolveTargetStep(this._step, { goto, delta });
    if (target === undefined) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }
    ++this._rev;
    this._step = target;
    this._root.classList.remove('out');
    if (skipAnimation) {
      this._root.classList.add('instant', 'visible');
      return { statusCode: 200, currentStep: this._step };
    }
    this._root.classList.remove('instant');
    // Force a reflow so the browser registers the starting state.
    void this._root.offsetWidth;
    this._root.classList.add('visible');
    await sleep(600);
    return { statusCode: 200, currentStep: this._step };
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

    if (data?.time !== undefined) this._time.textContent = data.time;
    if (data?.period !== undefined) this._period.textContent = data.period;
    if (data?.home !== undefined) this._homeName.textContent = data.home;
    if (data?.away !== undefined) this._awayName.textContent = data.away;
    this._updateActiveTeam(data);
    await new Promise(r => setTimeout(r, 350));
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    this._step = undefined;
    if (skipAnimation) {
      this._root.classList.add('instant');
      this._root.classList.remove('visible', 'out');
      return { statusCode: 200 };
    }
    this._root.classList.remove('instant');
    this._root.classList.add('out');
    await sleep(400);
    if (rev === this._rev) this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  // The renderer passes { id, payload, skipAnimation }, where id is one of the
  // customActions declared in the manifest.
  async customAction({ id, skipAnimation } = {}) {
    this._initDom();
    if (id === 'goal') {
      // The flash is pure animation, so skipping it leaves nothing to do.
      if (skipAnimation) return { statusCode: 200 };
      this._root.classList.add('goal');
      await sleep(800);
      this._root.classList.remove('goal');
      return { statusCode: 200 };
    }
    return { statusCode: 404, statusMessage: `Unknown custom action: ${id ?? ''}` };
  }

  async dispose() {
    this._rev = (this._rev ?? 0) + 1;
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}
