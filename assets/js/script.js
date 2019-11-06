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


var queryCurrentWeatherURL = "";
var queryForecastWeatherURL = "";
var queryUVIndexURL = "";


function current(response){
  console.log(response);
  city = response.name;
  currentIconCode = response.weather[0].icon;
  currentIconURL = `http://openweathermap.org/img/w/${currentIconCode}.png`;
  currentTemp = response.main.temp;
  currentHumidity = response.main.humidity;
  currentWind = response.wind.speed;
  console.log(currentWind);
}

// AJAX CALL FUNCTION
function ajaxCall(url){
    $.ajax({
        url: url,
        method: "GET"
      }).then(function(response) {
        // IF URL IS FOR 5 DAY FORECAST
          if(url === queryForecastWeatherURL){
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
console.log(currentUV); 
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
// * City
// console.log(response.name);

// * Date
// ????

// * Icon image (visual representation of weather conditions)
// var iconCode = response.weather[0].icon;
// var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

// * Temperature
// console.log(response.main.temp);

// * Humidity
// console.log(response.main.humidity);

// * Wind speed
// console.log(response.wind.speed);

// * UV index
// ?????

// * Include a 5-Day Forecast below the current weather conditions. Each day for the 5-Day Forecast should display the following:

//   * Date
// console.log(response.list[0].dt_txt); need to strip off time

//   * Icon image (visual representation of weather conditions)
// var iconCode = response.list[0].weather[0].icon;
// var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
// 
//   * Temperature
// console.log(response.list[0].main.temp);


//   * Humidity
// console.log(response.list[0].main.humidity);



searchCity();

