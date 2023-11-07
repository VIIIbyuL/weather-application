document.getElementById('search-button').addEventListener('click', function() {
  const city = document.getElementById('search-bar').value;
  const apiKey = import.meta.env.VITE_API_KEY; // Make sure this is your WeatherAPI.com key
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      updateWeatherDisplay(data);
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
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
