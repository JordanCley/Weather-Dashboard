var APIKey = "feb62cc847be5f32b6629a3d924facbc"; 
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

var forecastIconArray = [];
var forecastDateArray = [];
var forecastLowTempArray = [];
var forecastHighTempArray = [];
var forecastHumidityArray = [];
var forecastDateArray = [];


var queryCurrentWeatherURL = "";
var queryForecastWeatherURL = "";
var queryUVIndexURL = "";

function displayForecast(){
  
}

function displayCurrent(){
  $("#cityName").text(city);
  // console.log(currentIconURL); *** NEED TO LOOK INTO THIS ****
  // $("#currentIcon").attr("src", currentIconURL);
  $("#currentTemp").text(currentTemp);
  $("#currentHumid").text(currentHumidity);
  $("#currentWind").text(currentWind);
}

function forecast(response){
  for(let i = 0;i < 5;i ++){
    var icon = response.list[i].weather[0].icon;
    var minTemp = response.list[i].main.temp_min;
    var maxTemp = response.list[i].main.temp_max;
    var humid = response.list[i].main.humidity;
    var date = response.list[i].dt_txt;
    var stripDate = date.split(" ", 1);
    var joinDate = stripDate.join();
    forecastIconArray.push(`http://openweathermap.org/img/w/${icon}.png`);
    forecastLowTempArray.push(minTemp);
    forecastHighTempArray.push(maxTemp);
    forecastHumidityArray.push(humid);
    forecastDateArray.push(joinDate);
  }
  // console.log(forecastHumidityArray);
  // console.log(forecastDateArray);
}


function current(response){
  // console.log(response);
  city = response.name;
  currentIconCode = response.weather[0].icon;
  currentIconURL = `http://openweathermap.org/img/w/${currentIconCode}.png`;
  currentTemp = response.main.temp;
  currentHumidity = response.main.humidity;
  currentWind = response.wind.speed;
  displayCurrent();
  // console.log(currentWind);
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
            currentUvIndex(response);
            // console.log(response.value);
        
          }       
      });
}

function currentUvIndex(response){
  currentUV = response.value;
// console.log(currentUV); 
}

// GETTING UV INDEX QUERY URL FUNCTION
function getUvIndex(){
queryUVIndexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lattitude}&lon=${longitude}`;
// console.log(currentUV); 
}

// SEARCH INPUT FUNCTION SETTING ALL WEATHER QUERY URLS
function searchCity(){
  $("#form").submit(function(){
    event.preventDefault();
    citySearch = $("#search").val().trim();
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



searchCity();

