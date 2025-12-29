// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";


document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#state-input');
  const button = document.querySelector('#fetch-alerts');
  const alertsDisplay = document.querySelector('#alerts-display');
  const errorDiv = document.querySelector('#error-message');

  
  async function fetchWeatherAlerts(state) {
    try {
      if (!state || state.length !== 2) {
        throw new Error('Please enter a valid two-letter state abbreviation.');
      }

      const response = await fetch(`${weatherApi}${state.toUpperCase()}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      displayAlerts(data);
      clearError();
    } catch (error) {
      showError(error.message);
    } finally {
      input.value = '';
    }
  }


  function displayAlerts(data) {
    
    alertsDisplay.textContent = '';

    const numAlerts = data.features.length;
    const title = data.title || 'Weather Alerts';
    const summary = `${title}: ${numAlerts}`;
    
    const summaryEl = document.createElement('h3');
    summaryEl.textContent = summary;
    alertsDisplay.appendChild(summaryEl);

    if (numAlerts > 0) {
      const listEl = document.createElement('ul');
      data.features.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert.properties.headline || 'No headline';
        listEl.appendChild(li);
      });
      alertsDisplay.appendChild(listEl);
    }
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  button.addEventListener('click', () => {
    const state = input.value.trim();
    fetchWeatherAlerts(state);
  });
});

