// Variables declare for classes and ids
var historySec = document.querySelector("#history-card");
var searchHisEL = document.querySelector("#search-history");
var citySearchForm = document.querySelector("#city-search");
var forecastWeatherSec = document.querySelector("#forecast-section");
var currentWeatherBody = document.querySelector("#weather-body");
var forecastFive = document.querySelector("#five-day");
var citySearchInput = document.querySelector("#search-input");
var currentWeatherSec = document.querySelector("#current-weather");

// Declare variables for api
var APIkey = "e89f2b8ca1d1a42178fae232e65b15ee";
var urlStart = "https://api.openweathermap.org/data/2.5/";

//search history array which is mirrored in local storage
var curSearchHis = [];

// landing page function
function landingPage() {
  //on page load we want to display most recent search forecast
  if (localStorage.getItem("curSearchHis")) {
    showHistory();
    searchRender(curSearchHis[curSearchHis.length - 1]);
  }
}
// call landing page function as soon as open
landingPage();

//add search term to history [] & local storage
function addHistory(city) {
  if (localStorage.getItem("curSearchHis")) {
    curSearchHis = JSON.parse(localStorage.getItem("curSearchHis"));
  }
  curSearchHis.push(city);

  localStorage.setItem("curSearchHis", JSON.stringify(curSearchHis));

  //call function to display history
  showHistory();

  // for (var i = curSearchHis.length - 1; i >= 0; i--) {
  //   if (!city == curSearchHistory[i]) {
  //     curSearchHis.push(city);

  //     localStorage.setItem("curSearchHis", JSON.stringify(curSearchHis));
  //   }
  // }
  // showHistory();
}

// Display History
function showHistory() {
  searchHisEL.textContent = "";
  //console.log(curSearchHis);
  curSearchHis = JSON.parse(localStorage.getItem("curSearchHis"));
  for (var i = curSearchHis.length - 1; i >= 0; i--) {
    //console.log(curSearchHis[i]);
    var historySearch = document.createElement("li");
    historySearch.textContent = curSearchHis[i];
    historySearch.classList.add("list-group-item");
    historySearch.setAttribute("data-value", curSearchHis[i]);

    searchHisEL.appendChild(historySearch);
  }
}

// Get current weather API
function getCurrentWeather(city) {
  // aw ma ti khan tuah ding
  var weatherUrl =
    urlStart + "weather?q=" + city + "&units=metric&APPID=" + APIkey;

  $.ajax({
    url: weatherUrl,
    method: "GET",
  }).then(function (weatherResponse) {
    //console.log(weatherResponse);
    showCurrentWeather(weatherResponse);
  });
}

// Display today weather
function showCurrentWeather(weatherResponse) {
  //console.log(weatherResponse);
  var cityName = document.createElement("h1");

  var currentTime = moment();
  var currentDate = "(" + currentTime.format("DD/MM/YYYY") + ")";

  cityName.textContent = weatherResponse.name + " " + currentDate;

  var weatherImg = document.createElement("img");
  weatherImg.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" +
      weatherResponse.weather[0].icon +
      ".png"
  );
  weatherImg.setAttribute(
    "alt",
    weatherResponse.weather[0].main +
      " - " +
      weatherResponse.weather[0].description
  );

  //set up div for temp
  var cityTemp = document.createElement("div");
  cityTemp.textContent = "Temperature: " + weatherResponse.main.temp + " °C";

  //set up div for humidity
  var cityHumid = document.createElement("div");
  cityHumid.textContent = "Humidity: " + weatherResponse.main.humidity + "%";

  //set up div for wind
  var cityWind = document.createElement("div");
  cityWind.textContent = "Wind Speed: " + weatherResponse.wind.speed + " KMH";

  //add icon to header
  cityName.appendChild(weatherImg);

  //add everything to card
  currentWeatherBody.appendChild(cityName);
  currentWeatherBody.appendChild(cityTemp);
  currentWeatherBody.appendChild(cityWind);
  currentWeatherBody.appendChild(cityHumid);
}

//Get forecast API
function getForecastWeather(city) {
  var forecastUrl =
    urlStart + "forecast?q=" + city + "&units=metric&appid=" + APIkey;

  $.ajax({
    url: forecastUrl,
    method: "GET",
  }).then(function (forecastResponse) {
    //call function to create html elements for forecast response:
    showForecastWeather(forecastResponse);
  });
}

// Display  5 day Forecast weather
function showForecastWeather(forecastResponse) {
  for (var i = 0; i < forecastResponse.cnt; i++) {
    var responseRef = forecastResponse.list[i];

    var responseDate = moment(responseRef.dt_txt);
    //if the time is 12pm
    if (parseInt(responseDate.format("HH")) == 12) {
      var forecastCard = document.createElement("div");
      forecastCard.classList.add(
        "card",
        "bg-primary",
        "col-10",
        "col-lg-2",
        "p-0",
        "mx-auto",
        "mt-3"
      );

      var cardBody = document.createElement("div");
      cardBody.classList.add("card-body", "text-light", "p-2");

      var forecastTitle = document.createElement("h5");
      forecastTitle.classList.add("card-title");
      forecastTitle.textContent = responseDate.format("DD/MM/YYYY");

      var forecastImg = document.createElement("img");
      forecastImg.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" +
          responseRef.weather[0].icon +
          ".png"
      );
      forecastImg.setAttribute(
        "alt",
        responseRef.weather[0].main + " - " + responseRef.weather[0].description
      );

      var forecastTemp = document.createElement("div");
      forecastTemp.textContent = "Temp: " + responseRef.main.temp + " °C";

      var forecastWind = document.createElement("div");
      forecastWind.textContent = "Wind: " + responseRef.wind.speed + " KMH";

      var forecastHumid = document.createElement("div");
      forecastHumid.textContent =
        "Humidity: " + responseRef.main.humidity + "%";

      //adding everything to cardbody
      cardBody.appendChild(forecastTitle);
      cardBody.appendChild(forecastImg);
      cardBody.appendChild(forecastTemp);
      cardBody.appendChild(forecastWind);
      cardBody.appendChild(forecastHumid);

      forecastCard.appendChild(cardBody);
      forecastFive.appendChild(forecastCard);
    }
  }
}

// Search Starter
function searchRender(city) {
  currentWeatherBody.textContent = "";
  forecastFive.textContent = "";

  getCurrentWeather(city);
  getForecastWeather(city);
}

// Event listners
// search button
citySearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var city = citySearchInput.value.trim();
  if (!city) {
    return false;
  }
  searchRender(city);

  citySearchInput.value = "";

  addHistory(city);
});
// history
searchHisEL.addEventListener("click", function (event) {
  event.preventDefault();
  var itemClick = event.target;
  if (itemClick.matches("li")) {
    var clickSearch = itemClick.getAttribute("data-value");

    searchRender(clickSearch);
    addHistory(clickSearch);
  }
});
