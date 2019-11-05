var APIKey = "feb62cc847be5f32b6629a3d924facbc"; // "0d8e5cef9f1f9a5bc040c48374da619f"
var citySearch = "hawaii";
var lattitude = "";
var longitude = "";

var queryCurrentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ citySearch +"&mode=json&units=imperial&appid=" + APIKey;
var queryForecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ citySearch +"&mode=json&units=imperial&appid=" + APIKey;
// var queryUVIndexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lattitude + "&lon=" + longitude;

function ajaxCall(url){
    $.ajax({
        url: url,
        method: "GET"
      }).then(function(response) {
          if(url === queryForecastWeatherURL){
            // console.log(response.list[0]);
          } else if(url === queryCurrentWeatherURL){
            longitude += response.coord.lon;
            lattitude += response.coord.lat;
            console.log(typeof(lattitude));
            console.log(typeof(longitude));
            
          } else {
            console.log(response);
          }       
      });
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


ajaxCall(queryForecastWeatherURL);
ajaxCall(queryCurrentWeatherURL);
// ajaxCall(queryUVIndexURL);
