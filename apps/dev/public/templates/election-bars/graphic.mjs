/**
 * OGraf Election Bars — animated horizontal bar chart for election results.
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
  <div class="election">
    <div class="election-container">
      <div class="election-header">
        <span class="election-title"></span>
        <span class="election-subtitle"></span>
      </div>
      <div class="election-bars"></div>
    </div>
  </div>
`;

export default class ElectionBarsGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.election');
    this._title = this.querySelector('.election-title');
    this._subtitle = this.querySelector('.election-subtitle');
    this._barsContainer = this.querySelector('.election-bars');
    this._initialized = true;
  }

  _renderBars(parties) {
    this._barsContainer.innerHTML = parties.map((p, i) => `
      <div class="election-row" style="transition-delay: ${i * 100}ms">
        <div class="election-party">
          <div class="election-party-name">${escapeHtml(p.name)}</div>
          <div class="election-party-votes">${(Number(p.votes) || 0).toLocaleString()} votes</div>
        </div>
        <div class="election-bar-wrapper">
          <div class="election-bar-track">
            <div class="election-bar-fill" style="background: ${escapeHtml(p.color)}" data-pct="${Number(p.pct)}"></div>
          </div>
          <div class="election-pct ${Number(p.pct) >= 15 ? 'inside' : 'outside'}" data-pct="${Number(p.pct)}">
            <span class="election-pct-value">0%</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  _countUp(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + '%';
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  _animateBars() {
    const rows = this._barsContainer.querySelectorAll('.election-row');
    const fills = this._barsContainer.querySelectorAll('.election-bar-fill');
    const pctLabels = this._barsContainer.querySelectorAll('.election-pct');

    rows.forEach((row, i) => setTimeout(() => row.classList.add('show'), i * 120));

    setTimeout(() => {
      fills.forEach((fill, i) => {
        const pct = Number(fill.dataset.pct);
        fill.style.width = pct + '%';
        const label = pctLabels[i];
        if (label) {
          label.style.left = pct + '%';
          const valueEl = label.querySelector('.election-pct-value');
          if (valueEl) setTimeout(() => this._countUp(valueEl, pct, 900), 150);
        }
      });
    }, 200);
  }

  _applyData(data) {
    if (!data) return;
    if (data.title) this._title.textContent = data.title;
    if (data.subtitle) this._subtitle.textContent = data.subtitle;
    if (Array.isArray(data.parties)) this._renderBars(data.parties);
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
      await new Promise(r => setTimeout(r, 400));
      this._animateBars();
      await new Promise(r => setTimeout(r, 1400));
    } else {
      const fills = this._barsContainer.querySelectorAll('.election-bar-fill');
      const rows = this._barsContainer.querySelectorAll('.election-row');
      const labels = this._barsContainer.querySelectorAll('.election-pct');
      rows.forEach(r => r.classList.add('show'));
      fills.forEach((f, i) => {
        const pct = f.dataset.pct;
        f.style.transition = 'none';
        f.style.width = pct + '%';
        if (labels[i]) {
          labels[i].style.transition = 'none';
          labels[i].style.left = pct + '%';
          const v = labels[i].querySelector('.election-pct-value');
          if (v) v.textContent = pct + '%';
        }
      });
    }

    return { statusCode: 200, currentStep: 0 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    if (data?.title) this._title.textContent = data.title;
    if (data?.subtitle) this._subtitle.textContent = data.subtitle;
    if (Array.isArray(data?.parties)) {
      this._renderBars(data.parties);
      this._animateBars();
    }
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    this._root.classList.add('out');
    if (!skipAnimation) await new Promise(r => setTimeout(r, 400));
    this._root.classList.remove('visible', 'out');
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
