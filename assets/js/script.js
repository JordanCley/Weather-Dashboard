// API KEY
let APIKey = "feb62cc847be5f32b6629a3d924facbc";

let currentDisplay = $("#currentDisplay");

// CURRENT VARIABLES
let citySearch = "",
  lattitude = "",
  longitude = "",
  city = "",
  currentIconCode = "",
  currentIconURL = "",
  currentTemp = "",
  currentHumidity = "",
  currentWind = "",
  currentUV = "",
  currentDate = "";

// SEARCH HISTORY VARIABLES
let searches = [],
  storedSearches = [];

// FORECAST ARRAYS
let forecastIconArray = [],
  forecastDatesArray = [],
  forecastLowTempArray = [],
  forecastHighTempArray = [],
  forecastHumidityArray = [];

// AJAX QUERY URLS
let queryCurrentWeatherURL = "",
  queryForecastWeatherURL = "",
  queryUVIndexURL = "",
  queryGeoURL = "";

// USING OMENTS.JS TO GET FORECAST DATES
function forecastDates() {
  for (let i = 1; i < 6; i++) {
    let day = moment()
      .add(i, "days")
      .format("dddd MMM Do, YYYY");
    forecastDatesArray.push(day);
  }
}

// CLEARING SEARCH HISTORY WHEN BUTTON CLICK
function clearHistory() {
  $("#clear").on("click", function() {
    $(".list-group-item").remove();
    storedSearches = [];
    searches = [];
    localStorage.removeItem("searches");
  });
}

// SETTING VARIABLES TO UNDEFINED FOR RESEARCH
function reSearch() {
  citySearch = "";
  lattitude = "";
  longitude = "";
  city = "";
  currentIconCode = "";
  currentIconURL = "";
  currentTemp = "";
  currentHumidity = "";
  currentWind = "";
  currentUV = "";
  forecastIconArray = [];
  forecastDatesArray = [];
  forecastLowTempArray = [];
  forecastHighTempArray = [];
  forecastHumidityArray = [];
  queryCurrentWeatherURL = "";
  queryForecastWeatherURL = "";
  queryUVIndexURL = "";
  $(".days").remove();
}

// DISPLAYING SEARCH HISTORY AND ADDING EVENT LISTENER
function displayHistory() {
  $(".list-group-item").remove();
  for (let i = 0; i < storedSearches.length; i++) {
    var search = storedSearches[i];
    var searchItem = $("<li>").html(`${search}`);
    $(searchItem).addClass("list-group-item");
    $("#searchList").append(searchItem);
  }
  // ADDING CLICK LISTENER TO HISTORY
  $(".list-group-item").on("click", function() {
    reSearch();
    citySearch = $(this).text();
    currentDisplay.hide();
    queryCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    // console.log(citySearch);
    // console.log(queryCurrentWeatherURL);
    queryForecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    ajaxCall(queryForecastWeatherURL);
    ajaxCall(queryCurrentWeatherURL);
  });
}

// GETTING SEARCH HISTORY FROM LOCALSTORAGE
function getSearchHistory() {
  // console.log(localStorage.searches);
  for (let i = 0; i < localStorage.searches.length; i++) {
    var pastSearch = JSON.parse(localStorage.getItem("searches"));
  }
  storedSearches = pastSearch;
  displayHistory();
  // console.log(storedSearches);
}

// SAVING LOCAL SEARCHES TO LOACALSTORAGE
function saveSearches() {
  let search = citySearch;
  searches.push(search);
  localStorage.setItem("searches", JSON.stringify(searches));
  getSearchHistory();
}

// LOOPING THROUGH AND DYNAMICALLY CREATING FORECAST DAYS
function displayForecast() {
  for (let i = 0; i < 5; i++) {
    let date = forecastDatesArray[i];
    let icon = forecastIconArray[i];
    let highTemp = forecastHighTempArray[i];
    let lowTemp = forecastLowTempArray[i];
    let humidity = forecastHumidityArray[i];
    let day = $("<div>").html(
      `<div class="card h-100">
        <div class="card-body">
            <h4 class="card-title">
              ${date}
            </h4>
            <img
              class="card-img-top"
              src="${icon}"
              alt=""
            />
          <h6>High: <span>${highTemp}</span> &#8457; </h6>
          <h6>Low: <span>${lowTemp}</span> &#8457; </h6>
          <br />
          <h6>Humidity: <span>${humidity}</span> %</h6>
        </div>
      </div>`
    );
    $(day).addClass("col-sm m-1 days");
    $("#forecastList").append(day);
  }
}

// SETTING VARIABLES TO DISPLAY TEXT ON INDEX>HTML
function displayCurrent() {
  $("#cityName").text(city);
  console.log(currentIconURL);
  $("#currentIcon").attr("src", currentIconURL);
  $("#currentTemp").text(currentTemp);
  $("#currentHumid").text(currentHumidity);
  $("#currentWind").text(currentWind);
  $("#currentDate").text(` (${currentDate})`);
  currentDisplay.fadeIn();
}

// PUSHING RESPONSE PROPS INTO ARRAYS
function forecast(response) {
  for (let i = 0; i < 5; i++) {
    let icon = response.list[i].weather[0].icon;
    let minTemp = response.list[i].main.temp_min;
    let maxTemp = response.list[i].main.temp_max;
    let humid = response.list[i].main.humidity;

    // console.log(date);
    forecastIconArray.push(`http://openweathermap.org/img/w/${icon}.png`);
    forecastLowTempArray.push(minTemp);
    forecastHighTempArray.push(maxTemp);
    forecastHumidityArray.push(humid);
    forecastDates();
  }
  displayForecast();
}

// SETTING CURRENT PROPERTIES TO VARIABLES
function current(response) {
  city = response.name;
  currentIconCode = response.weather[0].icon;
  currentIconURL = `http://openweathermap.org/img/w/${currentIconCode}.png`;
  currentTemp = response.main.temp;
  currentHumidity = response.main.humidity;
  currentWind = response.wind.speed;
  currentDate = moment().format("dddd MMM Do, YYYY");
  displayCurrent();
}

// AJAX CALL FUNCTION
function ajaxCall(url) {
  $.ajax({
    url: url,
    method: "GET"
  }).then(function(response) {
    // IF URL IS FOR 5 DAY FORECAST
    if (url === queryForecastWeatherURL) {
      forecast(response);
      // console.log(response.list[0]);
      // ELS IF URL IS FOR CURRENT FORECAST
    } else if (url === queryCurrentWeatherURL) {
      current(response);
      // console.log(response.name);
      // REASSIGNING LON AND LAT TO GLOBAL VARIABLES
      longitude += response.coord.lon;
      lattitude += response.coord.lat;
      getUvIndex();
      ajaxCall(queryUVIndexURL);
      // console.log(lattitude);
      // console.log(longitude);
      // ELSE IS FOR URL FOR UV INDEX
    } else {
      // console.log(response.value);
      currentUvIndex(response);
      // console.log(response.value);
    }
  });
}

// SETTING CURRENT UV INDEX TO VARIABLE
function currentUvIndex(response) {
  currentUV = response.value;
  if (currentUV <= 2) {
    $("#currentUV").css("background-color", "#68FA58");
  }
  if (currentUV > 2 && currentUV < 6) {
    $("#currentUV").css("background-color", "#FAF20D");
  }
  if (currentUV >= 6 && currentUV < 8) {
    $("#currentUV").css("background-color", "#FC6C0D");
  }
  if (currentUV >= 8 && currentUV < 11) {
    $("#currentUV").css("background-color", "#FC0D0D");
  }
  if (currentUV >= 11) {
    $("#currentUV").css("background-color", "#8E23C4");
  }
  $("#currentUV").text(currentUV);
}

// GETTING UV INDEX QUERY URL FUNCTION
function getUvIndex() {
  queryUVIndexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lattitude}&lon=${longitude}`;
}

// SEARCH INPUT FUNCTION SETTING ALL WEATHER QUERY URLS
function searchCity() {
  $("#form").submit(function() {
    event.preventDefault();
    currentDisplay.hide();
    reSearch();
    citySearch = $("#search")
      .val()
      .trim();
    $("#search").val("");
    saveSearches();
    queryCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    // console.log(citySearch);
    // console.log(queryCurrentWeatherURL);
    queryForecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    ajaxCall(queryForecastWeatherURL);
    ajaxCall(queryCurrentWeatherURL);
  });
}

// CURRENT WEATHER
// * Date * MAYBE MOMENT.JS WOULD BE BETTER FOR ALL DATES??

function init() {
  searchCity();
  clearHistory();
  currentDisplay.hide();
}

$(document).ready(function() {
  init();
});

// geoLocation();

// function geoLocation(){
//   navigator.geolocation.getCurrentPosition(function(position) {
//   lattitude = position.coords.latitude;
//   console.log(lattitude);
//   longitude = position.coords.longitude;
//   console.log(longitude);
//   queryGeoURL = `https://api.openweathermap.org/data/2.5/weather?appid=${APIKey}&lat=${lattitude}&lon=${longitude}`;
//   console.log(queryGeoURL);
//   console.log(APIKey);
//   ajaxCall(queryGeoURL);
//   });
// }
