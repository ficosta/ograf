/**
 * OGraf Sport Lineup — team roster grid with staggered card reveal.
 *
 * DOM init is lazy (see _initDom). Do NOT call customElements.define() here;
 * the renderer picks the tag.
 */
export default class SportLineup extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = `
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
    `;
    this._root = this.querySelector('.lineup');
    this._team = this.querySelector('.lineup-team');
    this._meta = this.querySelector('.lineup-meta');
    this._grid = this.querySelector('.lineup-grid');
    this._formation = this.querySelector('.lineup-formation');
    this._coach = this.querySelector('.lineup-coach');
    this._initialized = true;
  }

  _renderPlayers(players) {
    this._grid.innerHTML = players.map((p, i) => `
      <div class="lineup-card" style="transition-delay: ${300 + i * 60}ms">
        <div class="lineup-number">${p.number}</div>
        <div class="lineup-player-name">${p.name}</div>
        <div class="lineup-position">${p.position}</div>
      </div>
    `).join('');
  }

  _applyData(data) {
    if (!data) return;
    if (data.team) this._team.textContent = data.team;
    if (data.meta) this._meta.textContent = data.meta;
    if (data.formation) this._formation.textContent = 'Formation: ' + data.formation;
    if (data.coach) this._coach.textContent = 'Coach: ' + data.coach;
    if (data.players) this._renderPlayers(data.players);
  }

  async load({ data } = {}) {
    this._initDom();
    this._applyData(data);
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.remove('out');
    void this._root.offsetWidth;
    this._root.classList.add('visible');

    if (!skipAnimation) {
      const cards = this._grid.querySelectorAll('.lineup-card');
      await new Promise(r => setTimeout(r, 300 + cards.length * 60 + 500));
    }

    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.add('out');
    if (!skipAnimation) await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.team) this._team.textContent = data.team;
    if (data?.players) this._renderPlayers(data.players);
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
