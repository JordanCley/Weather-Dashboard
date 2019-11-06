
// API KEY
var APIKey = "feb62cc847be5f32b6629a3d924facbc"; 

// CURRENT VARIABLES
var citySearch = "";
var lattitude = "";
var longitude = "";
var city = "";
var currentIconCode = "";
var currentIconURL = "";
var currentTemp = "";
var currentHumidity = "";
var currentWind = "";
var currentUV = "";

// SEARCH HISTORY VARIABLES
var searches = [];
var storedSearches = [];

// FORECAST ARRAYS
var forecastIconArray = [];
var forecastDateArray = [];
var forecastLowTempArray = [];
var forecastHighTempArray = [];
var forecastHumidityArray = [];

// AJAX QUERY URLS
var queryCurrentWeatherURL = "";
var queryForecastWeatherURL = "";
var queryUVIndexURL = "";

// CLEARING SEARCH HISTORY WHEN BUTTON CLICK
function clearHistory(){
  $("#clear").on("click", function(){
    console.log("clicked");
  $(".list-group-item").remove();
  storedSearches = [];
  searches = [];
  localStorage.removeItem("searches");
  });
}

// SETTING VARIABLES TO UNDEFINED FOR RESEARCH
function reSearch(){
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
  forecastDateArray = [];
  forecastLowTempArray = [];
  forecastHighTempArray = [];
  forecastHumidityArray = [];
  queryCurrentWeatherURL = "";
  queryForecastWeatherURL = "";
  queryUVIndexURL = "";
  $(".days").remove();
}

// DISPLAYIG SEARCH HISTORY AND ADDING EVENT LISTENER
function displayHistory(){
  $(".list-group-item").remove();
  for(let i = 0;i < storedSearches.length;i ++){
    var search = storedSearches[i];
    var searchItem = $("<li>").html(`${search}`);
    $(searchItem).addClass("list-group-item");
    $("#searchList").append(searchItem);
  }
  // ADDING CLICK LISTENER TO HISTORY
  $(".list-group-item").on("click", function(){
    reSearch();
    citySearch = $(this).text();
    queryCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    // console.log(citySearch);
    // console.log(queryCurrentWeatherURL);
    queryForecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    ajaxCall(queryForecastWeatherURL);
    ajaxCall(queryCurrentWeatherURL);
    console.log(citySearch);
  })
}

// GETTING SEARCH HISTORY FROM LOCALSTORAGE
function getSearchHistory(){
  // console.log(localStorage.searches);
  for(let i = 0;i < localStorage.searches.length;i ++){
    var pastSearch = JSON.parse(localStorage.getItem("searches"));
  }
  storedSearches = pastSearch;
  displayHistory();
  // console.log(storedSearches);
}

// SAVING LOCAL SEARCHES TO LOACALSTORAGE
function saveSearches(){
  var search = citySearch;
  searches.push(search);
  localStorage.setItem("searches", JSON.stringify(searches));
  getSearchHistory();
}

// LOOPING THROUGH AND DYNAMICALLY CREATING FORECAST DAYS
function displayForecast(){
  for(let i = 0;i < 5;i ++){
    // ***** DATE NOT WORKING PROP *****
    let date = forecastDateArray[i];
    let icon = forecastIconArray[i];
    let highTemp = forecastHighTempArray[i];
    let lowTemp = forecastLowTempArray[i];
    let humidity = forecastHumidityArray[i];
    let day = $("<div>").html(
      `<div class="card h-100 bg-info">
        <div class="card-body">
            <h4 class="card-title">
              ${date}
            </h4>
            <img
              class="card-img-top"
              src="${icon}"
              alt=""
            />
          <h6>High-temp: <span>${highTemp}</span> &#8457; </h6>
          <h6>Low-temp: <span>${lowTemp}</span> &#8457; </h6>
          <br />
          <h6>Humidity: <span>${humidity}</span> %</h6>
        </div>
      </div>`
    );
    $(day).addClass("col days");
    $("#forecastList").append(day);
  }
}

// SETTING VARIABLES TO DISPLAY TEXT ON INDEX>HTML
function displayCurrent(){
  $("#cityName").text(city);
  // console.log(currentIconURL); *** NEED TO LOOK INTO THIS ****
  // $("#currentIcon").attr("src", currentIconURL);
  $("#currentTemp").text(currentTemp);
  $("#currentHumid").text(currentHumidity);
  $("#currentWind").text(currentWind);
  // *** UNDEFINED HERE *****
  // console.log(currentUV);
  $("#currentUV").text(currentUV);
}

// PUSHING RESPONSE PROPS INTO ARRAYS
function forecast(response){
  for(let i = 0;i < 5;i ++){
    var icon = response.list[i].weather[0].icon;
    var minTemp = response.list[i].main.temp_min;
    var maxTemp = response.list[i].main.temp_max;
    var humid = response.list[i].main.humidity;
    var date = response.list[i].dt_txt;
    // console.log(date);
    var stripDate = date.split(" ", 1);
    var joinDate = stripDate.join();
    forecastIconArray.push(`http://openweathermap.org/img/w/${icon}.png`);
    forecastLowTempArray.push(minTemp);
    forecastHighTempArray.push(maxTemp);
    forecastHumidityArray.push(humid);
    forecastDateArray.push(joinDate);  
  }
  displayForecast();
  // console.log(forecastDateArray);
}

// SETTING CURRENT PROPERTIES TO VARIABLES
function current(response){
  city = response.name;
  currentIconCode = response.weather[0].icon;
  currentIconURL = `http://openweathermap.org/img/w/${currentIconCode}.png`;
  currentTemp = response.main.temp;
  currentHumidity = response.main.humidity;
  currentWind = response.wind.speed;
  displayCurrent();
}

// AJAX CALL FUNCTION
function ajaxCall(url){
    $.ajax({
        url: url,
        method: "GET"
      }).then(function(response) {
        // IF URL IS FOR 5 DAY FORECAST
          if(url === queryForecastWeatherURL){
            forecast(response);
            // console.log(response.list[0]);
            // ELS IF URL IS FOR CURRENT FORECAST
          } else if(url === queryCurrentWeatherURL){
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
function currentUvIndex(response){
  // console.log(response);
  currentUV += response.value;
  // ** HAS UV VALUE HERE **
// console.log(currentUV); 
}

// GETTING UV INDEX QUERY URL FUNCTION
function getUvIndex(){
queryUVIndexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lattitude}&lon=${longitude}`;
// console.log(queryUVIndexURL); 
}

// SEARCH INPUT FUNCTION SETTING ALL WEATHER QUERY URLS
function searchCity(){
  $("#form").submit(function(){
    event.preventDefault();
    reSearch();
    citySearch = $("#search").val().trim();
    $("#search").val("");
    saveSearches();
    queryCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    // console.log(citySearch);
    // console.log(queryCurrentWeatherURL);
    queryForecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&mode=json&units=imperial&appid=${APIKey}`;
    ajaxCall(queryForecastWeatherURL);
    ajaxCall(queryCurrentWeatherURL);
  })
}

// CURRENT WEATHER
// * Date * MAYBE MOMENT.JS WOULD BE BETTER FOR ALL DATES??

function init(){
  searchCity();
  clearHistory();
}

$(document).ready(function() {
  init();
});


