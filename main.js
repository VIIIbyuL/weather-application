document.getElementById('search-button').addEventListener('click', function() {
  const city = document.getElementById('search-bar').value;
  const apiKey = import.meta.env.VITE_API_KEY; // Make sure this is your WeatherAPI.com key

  // Fetch current weather
  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      updateWeatherDisplay(data); // Update current weather display
      return fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`); // Fetch forecast data
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(forecastData => {
      updateForecastDisplay(forecastData); // Update forecast display
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Here you could update the UI to show the error to the user
    });
});

function updateWeatherDisplay(data) {
  const weatherSection = document.getElementById('current-weather');
  weatherSection.innerHTML = ''; // Clear previous content

  // Check if the data object has the necessary properties
  if (data && data.current && data.location) {
    // Create and append new elements to display weather
    const cityHeader = document.createElement('h2');
    cityHeader.textContent = data.location.name;
    weatherSection.appendChild(cityHeader);

    const tempParagraph = document.createElement('p');
    tempParagraph.textContent = `Temperature: ${data.current.temp_c} °C`;
    weatherSection.appendChild(tempParagraph);

    const weatherParagraph = document.createElement('p');
    weatherParagraph.textContent = `Weather: ${data.current.condition.text}`;
    weatherSection.appendChild(weatherParagraph);

    // Optionally, add an image for the weather condition
    const weatherIcon = document.createElement('img');
    weatherIcon.src = data.current.condition.icon;
    weatherSection.appendChild(weatherIcon);

    // ...add more data as needed
  } else {
    // Handle the case where data is not in the expected format
    weatherSection.textContent = 'Weather data not available';
  }
}

function updateForecastDisplay(data) {
  const forecastSection = document.getElementById('forecast');
  forecastSection.innerHTML = '<h2>Forecast</h2>'; // Clear previous content and add title

  if (data && data.forecast && data.forecast.forecastday) {
    const parentDiv = document.createElement('div');
    parentDiv.className = 'forecast-container';
    forecastSection.appendChild(parentDiv);


    data.forecast.forecastday.forEach(day => {
      const forecastDiv = document.createElement('div');
      forecastDiv.className = 'forecast-day';

      const dateHeader = document.createElement('h3');
      dateHeader.textContent = day.date;
      forecastDiv.appendChild(dateHeader);

      const maxTempParagraph = document.createElement('p');
      maxTempParagraph.textContent = `Max Temp: ${day.day.maxtemp_c}°C`;
      forecastDiv.appendChild(maxTempParagraph);

      const minTempParagraph = document.createElement('p');
      minTempParagraph.textContent = `Min Temp: ${day.day.mintemp_c}°C`;
      forecastDiv.appendChild(minTempParagraph);

      const conditionImage = document.createElement('img');
      conditionImage.src = `https:${day.day.condition.icon}`; // Ensure the URL is correct
      forecastDiv.appendChild(conditionImage);

      const conditionParagraph = document.createElement('p');
      conditionParagraph.textContent = day.day.condition.text;
      forecastDiv.appendChild(conditionParagraph);

      parentDiv.appendChild(forecastDiv);
    });
  } else {
    forecastSection.appendChild(document.createTextNode('Forecast data not available'));
  }
}
