/**
 * OGraf Weather Forecast — CBS-inspired weather card
 *
 * A production-ready weather card showing current conditions
 * and a 3-day forecast. Implements the full OGraf Web Component lifecycle.
 */
export default class WeatherCard extends HTMLElement {

  connectedCallback() {
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

  /**
   * load() — Receive initial data and render context.
   */
  async load({ data }) {
    if (data?.location) this._location.textContent = data.location;
    if (data?.temp) this._temp.textContent = data.temp;
    if (data?.condition) this._condition.textContent = data.condition;
    if (data?.icon) this._icon.textContent = data.icon;
    if (data?.forecast) this._renderForecast(data.forecast);
    return { statusCode: 200 };
  }

  /**
   * playAction() — Slide the weather card onto screen.
   */
  async playAction({ delta = 1, goto, skipAnimation } = {}) {
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

  /**
   * stopAction() — Slide the weather card off screen.
   */
  async stopAction({ skipAnimation } = {}) {
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

  /**
   * updateAction() — Update weather data while on-air.
   */
  async updateAction({ data }) {
    if (data?.location) this._location.textContent = data.location;
    if (data?.temp) this._temp.textContent = data.temp;
    if (data?.condition) this._condition.textContent = data.condition;
    if (data?.icon) this._icon.textContent = data.icon;
    if (data?.forecast) this._renderForecast(data.forecast);
    return { statusCode: 200 };
  }

  /**
   * dispose() — Clean up resources.
   */
  async dispose() {
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}

customElements.define('weather-card', WeatherCard);
