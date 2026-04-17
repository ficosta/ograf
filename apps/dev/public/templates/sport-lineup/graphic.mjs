export default class SportLineup extends HTMLElement {
  connectedCallback() {
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
  }

  _renderPlayers(players) {
    this._grid.innerHTML = players.map((p, i) => `
      <div class="lineup-card" style="transition-delay: ${i * 60}ms">
        <div class="lineup-number">${p.number}</div>
        <div class="lineup-player-name">${p.name}</div>
        <div class="lineup-position">${p.position}</div>
      </div>
    `).join('');
  }

  async load({ data }) {
    if (data?.team) this._team.textContent = data.team;
    if (data?.meta) this._meta.textContent = data.meta;
    if (data?.formation) this._formation.textContent = 'Formation: ' + data.formation;
    if (data?.coach) this._coach.textContent = 'Coach: ' + data.coach;
    if (data?.players) this._renderPlayers(data.players);
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this._root.classList.remove('out');
    void this._root.offsetWidth;
    this._root.classList.add('visible');

    if (!skipAnimation) {
      await new Promise(r => setTimeout(r, 300));
      const cards = this._grid.querySelectorAll('.lineup-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });
      await new Promise(r => setTimeout(r, cards.length * 60 + 500));
    }

    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._root.classList.add('out');
    if (!skipAnimation) await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
    return { statusCode: 200 };
  }

  async updateAction({ data }) {
    if (data?.team) this._team.textContent = data.team;
    if (data?.players) this._renderPlayers(data.players);
    return { statusCode: 200 };
  }

  async dispose() { this.innerHTML = ''; return { statusCode: 200 }; }
}

customElements.define('sport-lineup', SportLineup);
