/**
 * OGraf Weather Forecast — current conditions + 3-day forecast row.
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
  <div class="weather">
    <div class="weather-card">
      <div class="weather-main">
        <div class="weather-icon"></div>
        <div class="weather-info">
          <div class="weather-location"></div>
          <div class="weather-temp"></div>
          <div class="weather-condition"></div>
        </div>
      </div>
      <div class="weather-forecast"></div>
    </div>
  </div>
`;

export default class WeatherGraphic extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = TEMPLATE;
    this._root = this.querySelector('.weather');
    this._icon = this.querySelector('.weather-icon');
    this._location = this.querySelector('.weather-location');
    this._temp = this.querySelector('.weather-temp');
    this._condition = this.querySelector('.weather-condition');
    this._forecast = this.querySelector('.weather-forecast');
    this._initialized = true;
  }

  _renderForecast(forecast) {
    if (!Array.isArray(forecast)) return;
    this._forecast.innerHTML = forecast.map((day, i) => `
      <div class="weather-forecast-day" style="transition-delay: ${500 + i * 60}ms">
        <div class="weather-forecast-label">${escapeHtml(day.day)}</div>
        <div class="weather-forecast-icon">${escapeHtml(day.icon)}</div>
        <div class="weather-forecast-temp">${escapeHtml(day.temp)}</div>
      </div>
    `).join('');
  }

  _applyData(data) {
    if (!data) return;
    if (data.location) this._location.textContent = data.location;
    if (data.temp) this._temp.textContent = data.temp;
    if (data.condition) this._condition.textContent = data.condition;
    if (data.icon) this._icon.textContent = data.icon;
    if (data.forecast) this._renderForecast(data.forecast);
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
    await new Promise(r => setTimeout(r, 1000));
    return { statusCode: 200, currentStep: 0 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this._initDom();
    if (skipAnimation) {
      this._root.classList.remove('visible');
      return { statusCode: 200 };
    }
    this._root.classList.add('out');
    await new Promise(r => setTimeout(r, 500));
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
