document.getElementById("search-bar").addEventListener("input", function () {
  const userInput = this.value;
  const apiKey = VITE_API_KEY;
  const autocompleteUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${userInput}`;

  if (userInput.length > 0) {
    fetch(autocompleteUrl)
      .then((response) => response.json())
      .then((suggestions) => {
        showSuggestions(suggestions);
      })
      .catch((error) =>
        console.error("Error fetching autocomplete suggestions:", error)
      );
  } else {
    hideSuggestions();
  }
});

function showSuggestions(suggestions) {
  const suggestionsList = document.getElementById("suggestions-list");
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = 'block';

  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("li");
    suggestionItem.textContent = suggestion.name;
    suggestionItem.addEventListener("click", function () {
      document.getElementById("search-bar").value = suggestion.name;
      hideSuggestions();
    });
    suggestionsList.appendChild(suggestionItem);
  });
}

function hideSuggestions() {
  const suggestionsList = document.getElementById("suggestions-list");
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = 'none';
}

document.getElementById("search-button").addEventListener("click", function () {
  const city = document.getElementById("search-bar").value;
  const apiKey = import.meta.env.VITE_API_KEY; 

  hideSuggestions();

  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      updateWeatherDisplay(data);
      return fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((forecastData) => {
      updateForecastDisplay(forecastData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function updateWeatherDisplay(data) {
  const weatherSection = document.getElementById("current-weather");
  weatherSection.innerHTML = "";

  if (data && data.current && data.location) {
    const cityHeader = document.createElement("h2");
    cityHeader.textContent = data.location.name;
    weatherSection.appendChild(cityHeader);

    const tempParagraph = document.createElement("p");
    tempParagraph.textContent = `Temperature: ${data.current.temp_c} °C`;
    weatherSection.appendChild(tempParagraph);

    const weatherParagraph = document.createElement("p");
    weatherParagraph.textContent = `Weather: ${data.current.condition.text}`;
    weatherSection.appendChild(weatherParagraph);

    const weatherIcon = document.createElement("img");
    weatherIcon.src = data.current.condition.icon;
    weatherSection.appendChild(weatherIcon);

  } else {
    weatherSection.textContent = "Weather data not available";
  }
}

function updateForecastDisplay(data) {
  const forecastSection = document.getElementById("forecast");
  forecastSection.innerHTML = "<h2>Forecast</h2>";

  if (data && data.forecast && data.forecast.forecastday) {
    const parentDiv = document.createElement("div");
    parentDiv.className = "forecast-container";
    forecastSection.appendChild(parentDiv);

    data.forecast.forecastday.forEach((day) => {
      const forecastDiv = document.createElement("div");
      forecastDiv.className = "forecast-day";

      const dateHeader = document.createElement("h3");
      dateHeader.textContent = day.date;
      forecastDiv.appendChild(dateHeader);

      const maxTempParagraph = document.createElement("p");
      maxTempParagraph.textContent = `Max Temp: ${day.day.maxtemp_c}°C`;
      forecastDiv.appendChild(maxTempParagraph);

      const minTempParagraph = document.createElement("p");
      minTempParagraph.textContent = `Min Temp: ${day.day.mintemp_c}°C`;
      forecastDiv.appendChild(minTempParagraph);

      const conditionImage = document.createElement("img");
      conditionImage.src = `https:${day.day.condition.icon}`; 
      forecastDiv.appendChild(conditionImage);

      const conditionParagraph = document.createElement("p");
      conditionParagraph.textContent = day.day.condition.text;
      forecastDiv.appendChild(conditionParagraph);

      parentDiv.appendChild(forecastDiv);
    });
  } else {
    forecastSection.appendChild(
      document.createTextNode("Forecast data not available")
    );
  }
}
