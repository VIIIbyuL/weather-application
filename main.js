document.getElementById('search-button').addEventListener('click', function() {
  const city = document.getElementById('search-bar').value;
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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
  if (data && data.main && data.weather && data.weather.length > 0) {
    // Create and append new elements to display weather
    const cityHeader = document.createElement('h2');
    cityHeader.textContent = data.name;
    weatherSection.appendChild(cityHeader);

    const tempParagraph = document.createElement('p');
    tempParagraph.textContent = `Temperature: ${data.main.temp} °C`;
    weatherSection.appendChild(tempParagraph);

    const weatherParagraph = document.createElement('p');
    weatherParagraph.textContent = `Weather: ${data.weather[0].main}`;
    weatherSection.appendChild(weatherParagraph);

    // ...add more data as needed
  } else {
    // Handle the case where data is not in the expected format
    weatherSection.textContent = 'Weather data not available';
  }
}
