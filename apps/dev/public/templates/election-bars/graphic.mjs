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
  <div class="election-bars-root">
  <div class="election">
    <div class="election-container">
      <div class="election-header">
        <span class="election-title"></span>
        <span class="election-subtitle"></span>
      </div>
      <div class="election-bars"></div>
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

export default class ElectionBarsGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.election');
    this._title = this.querySelector('.election-title');
    this._subtitle = this.querySelector('.election-subtitle');
    this._barsContainer = this.querySelector('.election-bars');
    this._step = undefined;
    this._rev = 0;
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

  // Grow the bars from zero. Every timer checks the revision it started under,
  // so a stop (or a newer play) that lands mid-reveal is never overwritten.
  _animateBars(rev) {
    const rows = this._barsContainer.querySelectorAll('.election-row');
    const fills = this._barsContainer.querySelectorAll('.election-bar-fill');
    const pctLabels = this._barsContainer.querySelectorAll('.election-pct');

    rows.forEach((row, i) => setTimeout(() => {
      if (rev === this._rev) row.classList.add('show');
    }, i * 120));

    setTimeout(() => {
      if (rev !== this._rev) return;
      fills.forEach((fill, i) => {
        const pct = Number(fill.dataset.pct);
        fill.style.width = pct + '%';
        const label = pctLabels[i];
        if (label) {
          label.style.left = pct + '%';
          const valueEl = label.querySelector('.election-pct-value');
          if (valueEl) setTimeout(() => {
            if (rev === this._rev) this._countUp(valueEl, pct, 900);
          }, 150);
        }
      });
    }, 200);
  }

  // skipAnimation: the end state at once. The root carries `.instant`, which
  // turns every transition off, so widths and rows land without animating.
  _showBarsInstantly() {
    this._barsContainer.querySelectorAll('.election-row').forEach((row) => row.classList.add('show'));
    this._barsContainer.querySelectorAll('.election-bar-fill').forEach((fill) => {
      fill.style.width = fill.dataset.pct + '%';
    });
    this._barsContainer.querySelectorAll('.election-pct').forEach((label) => {
      label.style.left = label.dataset.pct + '%';
      const value = label.querySelector('.election-pct-value');
      if (value) value.textContent = label.dataset.pct + '%';
    });
  }

  // Back to the pre-play state, so the next play grows the bars again.
  _resetBars() {
    this._barsContainer.querySelectorAll('.election-row').forEach((row) => row.classList.remove('show'));
    this._barsContainer.querySelectorAll('.election-bar-fill').forEach((fill) => { fill.style.width = ''; });
    this._barsContainer.querySelectorAll('.election-pct').forEach((label) => {
      label.style.left = '';
      const value = label.querySelector('.election-pct-value');
      if (value) value.textContent = '0%';
    });
  }

  _applyData(data) {
    if (!data) return;
    if (data.title !== undefined) this._title.textContent = data.title;
    if (data.subtitle !== undefined) this._subtitle.textContent = data.subtitle;
    if (Array.isArray(data.parties)) this._renderBars(data.parties);
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
    const rev = ++this._rev;
    this._step = target;
    this._root.classList.remove('out');

    if (skipAnimation) {
      this._root.classList.add('instant', 'visible');
      this._showBarsInstantly();
    } else {
      this._root.classList.remove('instant');
      void this._root.offsetWidth;
      this._root.classList.add('visible');
      await sleep(400);
      if (rev !== this._rev) return { statusCode: 200, currentStep: this._step };
      this._animateBars(rev);
      await sleep(1400);
    }

    return { statusCode: 200, currentStep: this._step };
  }

  async updateAction({ data, skipAnimation } = {}) {
    this._initDom();
    if (data?.title !== undefined) this._title.textContent = data.title;
    if (data?.subtitle !== undefined) this._subtitle.textContent = data.subtitle;
    if (Array.isArray(data?.parties)) {
      this._renderBars(data.parties);
      // Off air, the new rows just wait for the next play to reveal them.
      if (this._step !== undefined) {
        if (skipAnimation) this._showBarsInstantly();
        else this._animateBars(this._rev);
      }
    }
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    const rev = ++this._rev;
    this._step = undefined;
    if (skipAnimation) {
      this._root.classList.add('instant');
      this._root.classList.remove('visible', 'out');
      this._resetBars();
      return { statusCode: 200 };
    }
    this._root.classList.remove('instant');
    this._root.classList.add('out');
    await sleep(400);
    if (rev === this._rev) {
      this._root.classList.remove('visible', 'out');
      this._resetBars();
    }
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
