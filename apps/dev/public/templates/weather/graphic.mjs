/**
 * OGraf Weather Forecast — current conditions + 3-day outlook.
 *
 * DOM init happens lazily in _initDom(). Real OGraf players drive the
 * lifecycle on detached elements — connectedCallback does not fire. Do NOT
 * call customElements.define() here; the renderer picks the tag.
 */
export default class WeatherCard extends HTMLElement {

  _initDom() {
    if (this._initialized) return;
    this.innerHTML = `
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
    this._root = this.querySelector('.weather');
    this._icon = this.querySelector('.weather-icon');
    this._location = this.querySelector('.weather-location');
    this._temp = this.querySelector('.weather-temp');
    this._condition = this.querySelector('.weather-condition');
    this._forecast = this.querySelector('.weather-forecast');
    this._step = undefined;
    this._initialized = true;
  }

  _renderForecast(forecast) {
    if (!forecast || !Array.isArray(forecast)) return;
    this._forecast.innerHTML = forecast.map((day, i) => `
      <div class="weather-forecast-day" style="transition-delay: ${500 + i * 60}ms">
        <div class="weather-forecast-label">${day.day}</div>
        <div class="weather-forecast-icon">${day.icon}</div>
        <div class="weather-forecast-temp">${day.temp}</div>
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
    await new Promise(resolve => setTimeout(resolve, 700));
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
    await new Promise(resolve => setTimeout(resolve, 500));
    this._root.classList.remove('visible', 'out');
    this._step = undefined;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this._initDom();
    this._applyData(data);
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
