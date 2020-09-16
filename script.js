let searchBtn = $("#searchBtn");
let currentCity = $("#currentCity");
let currentTemp = $("#currentTemp");
let currentHumid = $("#currentHumid");
let windSpeed = $("#windSpeed");
let uvIndex = $("#uvIndex");
let newCities = [];

//Render weather for previous session's last search
weather(JSON.parse(localStorage.getItem("lastCity")))

//Add enter key click event
let formEnter = $("#citySearch")

formEnter.on("keyup", function(event){
    if (event.keyCode === 13){
        event.preventDefault();
        searchBtn.click();
    }
});

//Render weather for current search
searchBtn.on("click", function(){
    let city = $(this).siblings("input").val();

    localStorage.setItem("lastCity", JSON.stringify(city));

    newCities.unshift(city);

    weather(city);

    //Loop to genreate new buttons for search history
    $("#btn-group").empty();

    for(i=0; i < newCities.length; i++){
        var newCityBtn = $("<button>");
        newCityBtn.attr("type","button");
        newCityBtn.attr("class", "btn btn-light");
        newCityBtn.attr("id","savedBtn");
        newCityBtn.text(newCities[i]);
    
        $("#btn-group").append(newCityBtn);
        
        //Click event to render weather added to history buttons
        newCityBtn.on("click", function(){
            let city = ($(this)[0].textContent);
            weather(city)
        })
        
    }

})

//Function for setting weather information from api
function weather(city){
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=34596773a370c1a30e92b7c441dab9aa"
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        let cityLat = response.coord.lat;
        let cityLon = response.coord.lon;
        let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=34596773a370c1a30e92b7c441dab9aa&lat=" + cityLat + "&lon=" + cityLon;
        
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function(uvResponse){
            let weatherImg = $("#weatherImg");
            weatherImg.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            currentCity.text(city+" (" + moment().format('L') + ")");
            currentTemp.text("Temperature: " + response.main.temp + " F");
            currentHumid.text("Humidity: " + response.main.humidity +"%");
            windSpeed.text("WindSpeed: " + response.wind.speed + " MPH");
            uvIndex.text("UV Index: " + uvResponse.value);
            if(uvResponse.value>=8){
                uvIndex.attr("class","uvSevere");
            }else if(uvResponse.value>=6 && uvResponse.value<8){
                uvIndex.attr("class","uvModerate");
            }else if(uvResponse.value>=3 && uvResponse.value<6){
                uvIndex.attr("class","uvFavorable");
            }else if(uvResponse.value>0 && uvResponse.value<3){
                uvIndex.attr("class","uvLow");
            }


        })

        let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" + cityLon + "&exclude=minutely,hourly&units=imperial&appid=34596773a370c1a30e92b7c441dab9aa"

        $.ajax({
            url: forecastUrl,
            metod: "GET"
        }).then(function(forecastResponse){
            $("#forecast").text("");


            for(i=0; i<5; i++){
                let forecastEl = $("<div>");
                let forecastDate = $("<h5>");
                let forecastIcon = $("<img>");
                let forecastTemp = $("<p>");
                let forecastHumid = $("<p>");
                forecastEl.attr("class", "daily");
                forecastIcon.attr("class", "iconBg")

                forecastDate.text(moment().add(i+1, "days").format("l"));
                forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastResponse.daily[i+1].weather[0].icon + ".png");
                forecastTemp.text("Temp: " + forecastResponse.daily[i+1].temp.max + " F");
                forecastHumid.text("Humidity: " + forecastResponse.daily[i+1].humidity + " %");
                
                $("#forecast").append(forecastEl);
                forecastEl.append(forecastDate);
                forecastEl.append(forecastIcon);
                forecastEl.append(forecastTemp);
                forecastEl.append(forecastHumid);
            }
        })
        
    })

}