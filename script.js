$(document).ready(function() {
    let keyWord = "Austin"
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + keyWord + "&units=imperial&appid=34596773a370c1a30e92b7c441dab9aa"
    let dailyURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + keyWord + "&units=imperial&exclude=hourly,minutely&appid=34596773a370c1a30e92b7c441dab9aa"
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        
        })     
    
        $.ajax({
        url: dailyURL,
        method: "GET"
    }).then(function(forecast){
        console.log(forecast);
        
        })     
})