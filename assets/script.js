const APIKEY = "79564d65443999fbd44fa53717a9b123";
populateSearchHistory();

$("#citySearchBtn").on("click", function(event) {
  event.preventDefault();
  let citySearched = $("#citySearchText").val();
  $("#citySearchText").val("");
  $("#searchResults").fadeIn();
  getCurrentWeatherConditions(citySearched);
  getFiveDayForecast(citySearched);
});

// Showing previous searches in sidebar.
function populateSearchHistory() {
    $("#searchHistoryList").empty();
    let searchHistory = getStoredWeatherData().searchHistory;
    if (searchHistory) {
      for (let i = 0; i < searchHistory.length; i++) {
        let item = $("<li class='list-group-item'></li>");
        item.text(searchHistory[i].cityName);
        $("#searchHistoryList").prepend(item);
      }
      $(".list-group-item").on("click", function() {
        $("#searchResults").fadeIn("slow");
        getCurrentWeatherConditions($(this).text());
        getFiveDayForecast($(this).text());
      });
    }
  }

// Returning the weather data of the user's previous searches so that less API calls will be made, or
// returns an empty structure if no data has been stored yet.
function getStoredWeatherData() {
    let storedWeatherData = JSON.parse(localStorage.getItem("storedWeatherData"));
    if (!storedWeatherData) {
      return {
        searchHistory: [],
        data: {
          currentWeather: [],
          forecast: []
        }
      };
    } else {
      return storedWeatherData;
    }
  }
  
// Looking in local storage for weather data of user's search
function getCurrentWeatherConditions(citySearched) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${APIKEY}`;
    let storedWeatherData = getStoredWeatherData();
    let searchHistory = storedWeatherData.searchHistory;
    let timeNow = new Date().getTime();
    citySearched = citySearched.toLowerCase().trim();
    for (let i = 0; i < searchHistory.length; i++) {
      if (
        searchHistory[i].cityName.toLowerCase() == citySearched &&
        timeNow < searchHistory[i].dt * 1000 + 600000
      ) {
        for (let j = 0; j < storedWeatherData.data.currentWeather.length; j++) {
          if (
            storedWeatherData.data.currentWeather[j].name.toLowerCase() ==
            citySearched
          ) {
            populateCurrentWeatherConditions(
              storedWeatherData.data.currentWeather[j]
            );
            return;
          }
        }
      }
    }
    
// Making an API call to get the current weather if not in storage
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(results) {
    populateCurrentWeatherConditions(results);
    storeCurrentWeather(results);
  });
}

// Storing the current weather data of the API call.
function storeCurrentWeather(results) {
    let storedWeatherData = getStoredWeatherData();
    let searchHistoryEntry = {
      cityName: results.name,
      dt: results.dt
    };
    storedWeatherData.searchHistory.push(searchHistoryEntry);
    storedWeatherData.data.currentWeather.push(results);
    localStorage.setItem("storedWeatherData", JSON.stringify(storedWeatherData));
  }

// Current weather data retrieved either from local storage or API call
function populateCurrentWeatherConditions(results) {
    let cityName = results.name;
    let date = new Date(results.dt * 1000);
    let description = results.weather[0].main;
    let humidity = results.main.humidity;
    let iconURL = `https://openweathermap.org/img/w/${results.weather[0].icon}.png`;
    let temp = results.main.temp;
    let windSpeed = results.wind.speed;
  
    let lon = results.coord.lon;
    let lat = results.coord.lat;
  
// Adding data to the page.
    $("#currentCity").text(cityName);
    $("#todaysDate").text(
      `(${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`
    );
    $("#currentWeatherIcon").attr("src", iconURL);
    $("#currentWeatherIcon").attr("alt", description + " icon");
    $("#todaysTemp").text(temp);
    $("#todaysHumidity").text(humidity);
    $("#todaysWindSpeed").text(windSpeed);
  
    populateUVIndex(lon, lat);
  }

// Locating UV Index for searched city in local storage, or makes an API call to obtain the data.
function populateUVIndex(lon, lat) {
    let UVIndexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`;
    $.ajax({
      url: UVIndexURL,
      method: "GET"
    }).then(function(results) {
      let UVIndex = results.value;
      let currUVLevel = $("#todaysUVIndex").attr("data-uv-level");
      $("#todaysUVIndex").removeClass(currUVLevel);
      $("#todaysUVIndex").text(UVIndex);
      if (UVIndex < 3) {
        $("#todaysUVIndex").attr("data-uv-level", "uv-low");
      } else if (UVIndex < 6) {
        $("#todaysUVIndex").attr("data-uv-level", "uv-mod");
      } else if (UVIndex < 8) {
        $("#todaysUVIndex").attr("data-uv-level", "uv-high");
      } else if (UVIndex < 11) {
        $("#todaysUVIndex").attr("data-uv-level", "uv-very-high");
      } else {
        $("#todaysUVIndex").attr("data-uv-level", "uv-ext");
      }
      $("#todaysUVIndex").addClass($("#todaysUVIndex").attr("data-uv-level"));
    });
  }

// Searching local storage for forecast of city, or makes an API call if not found.
function getFiveDayForecast(citySearched) {
    let storedWeatherData = getStoredWeatherData();
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearched}&units=imperial&appid=${APIKEY}`;
    let today = new Date().getDate();
    for (let i = 0; i < storedWeatherData.searchHistory.length; i++) {
      let savedDate = new Date(
        storedWeatherData.searchHistory[i].dt * 1000
      ).getDate();
      if (
        storedWeatherData.searchHistory[i].cityName.toLowerCase() ==
          citySearched &&
        savedDate == today
      ) {
        for (let j = 0; j < storedWeatherData.data.forecast.length; j++) {
          if (
            storedWeatherData.data.forecast[j].city.name.toLowerCase() ==
            citySearched.toLowerCase()
          ) {
            populateForecast(storedWeatherData.data.forecast[j]);
            return;
          }
        }
      }
    }
    $.ajax({
      url: forecastURL,
      method: "GET"
    }).then(function(results) {
      populateForecast(results);
      storeForecast(results, citySearched);
    });
  }
  
// Storing the forecast of the city to local storage if not found.
function storeForecast(results, citySearched) {
    citySearched = citySearched.toLowerCase().trim();
    let storedWeatherData = getStoredWeatherData();
    storedWeatherData.data.forecast.push(results);
    localStorage.setItem("storedWeatherData", JSON.stringify(storedWeatherData));
  }