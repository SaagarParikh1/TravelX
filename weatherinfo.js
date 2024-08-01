const apiKey_weather = '5197339b75f5815f3b9a362f2f5f148b';
const endpoint_weather = 'https://api.openweathermap.org/data/2.5/weather?';

function displaySavedLocation() {
  var savedLocation = localStorage.getItem("savedLocation");
  if (savedLocation) {
    document.getElementById("location").textContent = savedLocation;
    document.getElementById("locationInput").value = savedLocation;
    getWeather(savedLocation);
  }
}

function getWeather(location) {
  var url = `${endpoint_weather}q=${location}&appid=${apiKey_weather}&units=imperial`; // Units set to imperial for Fahrenheit
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Extract the relevant weather information from the API response
      var temperature = data.main.temp;
      var feelsLike = data.main.feels_like;
      var highTemperature = data.main.temp_max;
      var lowTemperature = data.main.temp_min;
      var windSpeed = data.wind.speed;
      var humidity = data.main.humidity;
      var sunriseTimestamp = data.sys.sunrise * 1000; // Convert sunrise timestamp to milliseconds
      var sunsetTimestamp = data.sys.sunset * 1000; // Convert sunset timestamp to milliseconds
      var weatherDescription = data.weather[0].description;

      // Format sunrise time
      var sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Format sunset time
      var sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update the weather information on the page
      document.getElementById("temperature").textContent = temperature + "F";
      document.getElementById("feelsLike").textContent = feelsLike + "F";
      document.getElementById("highTemperature").textContent = highTemperature + "F";
      document.getElementById("lowTemperature").textContent = lowTemperature + "F";
      document.getElementById("windSpeed").textContent = windSpeed + " mph";
      document.getElementById("humidity").textContent = humidity + "%";
      document.getElementById("sunriseTime").textContent = sunriseTime;
      document.getElementById("sunsetTime").textContent = sunsetTime;
      document.getElementById("weatherDescription").textContent = weatherDescription;
    })
    .catch(error => {
      console.log("Error fetching weather data:", error);
    });
}

function updateLocation() {
  var locationInput = document.getElementById("locationInput");
  var location = locationInput.value;
  location = capitalizeFirstLetter(location);
  localStorage.setItem("savedLocation", location);
  document.getElementById("location").textContent = location;
  getWeather(location);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
