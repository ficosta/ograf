/**
 * OGraf Sport Lineup — team roster grid with staggered player card reveal.
 *
 * Designed for the OGraf iframe mount model: loads its stylesheet via a
 * <link rel="stylesheet"> tag whose URL is computed from import.meta.url,
 * so it resolves wherever the renderer serves the package from.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define()
 * here — the renderer picks the tag.
 */

const STYLE_URL = new URL('./style.css', import.meta.url).href;

const TEMPLATE = `
  <link rel="stylesheet" href="${STYLE_URL}">
  <div class="sport-lineup-root">
  <div class="lineup">
    <div class="lineup-container">
      <div class="lineup-header">
        <span class="lineup-team"></span>
        <span class="lineup-meta"></span>
      </div>
      <div class="lineup-grid"></div>
      <div class="lineup-footer">
        <span class="lineup-formation"></span>
        <span class="lineup-coach"></span>
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

export default class SportLineupGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.lineup');
    this._team = this.querySelector('.lineup-team');
    this._meta = this.querySelector('.lineup-meta');
    this._grid = this.querySelector('.lineup-grid');
    this._formation = this.querySelector('.lineup-formation');
    this._coach = this.querySelector('.lineup-coach');
    this._step = undefined;
    this._rev = 0;
    this._initialized = true;
  }

  _renderPlayers(players) {
    this._grid.innerHTML = players.map((p, i) => `
      <div class="lineup-card" style="transition-delay: ${300 + i * 60}ms">
        <div class="lineup-number">${escapeHtml(p.number)}</div>
        <div class="lineup-player-name">${escapeHtml(p.name)}</div>
        <div class="lineup-position">${escapeHtml(p.position)}</div>
      </div>
    `).join('');
  }

  _applyData(data) {
    if (!data) return;
    if (data.team !== undefined) this._team.textContent = data.team;
    if (data.meta !== undefined) this._meta.textContent = data.meta;
    // An emptied field clears the whole line, label included.
    if (data.formation !== undefined) this._formation.textContent = data.formation ? 'Formation: ' + data.formation : '';
    if (data.coach !== undefined) this._coach.textContent = data.coach ? 'Coach: ' + data.coach : '';
    if (Array.isArray(data.players)) this._renderPlayers(data.players);
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
    await sleep(300 + this._grid.querySelectorAll('.lineup-card').length * 60 + 500);
    return { statusCode: 200, currentStep: this._step };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
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

  // Every OGraf graphic must expose customAction, even without any declared.
  // The renderer passes { id, payload, skipAnimation }; an unknown id is a 4xx.
  async customAction({ id } = {}) {
    return { statusCode: 404, statusMessage: `Unknown custom action: ${id ?? ''}` };
  }

  async dispose() {
    this._rev = (this._rev ?? 0) + 1;
    this.innerHTML = '';
    this._initialized = false;
    return { statusCode: 200 };
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
