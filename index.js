'use strict';

// server section

const express = require('express');
const cors = require('cors');

const server = express();

const PORT = 3000;

server.use(cors());


// Location Section

server.get('/location', callLocation);

function Location(input) {
  this.search_query = input.display_name;
  this.formatted_query = input.formatted_query;
  this.latitude = input.latitude;
  this.longitude = input.longitude;
}


function callLocation(request, response) {
  let getLocation = require('./data/location.json');
  let res = new Location(request.query.city, getLocation[0].display_name, getLocation[0].lat, getLocation[0].lon);
  response.send(res);
}

// Weather section

server.get('/weather', callWeather);

function Weather(input) {
  this.forecast = input.forecast;
  this.time = input.time;
}

function callWeather( response){
  const getWeather = require('./data/weather.json');
  const weatherArray =[];
  getWeather.data.forEach((element)=>{
    weatherArray.push(new Weather(element.weather.description, element.valid_date));
  })
  response.send(weatherArray);
}



// function callLocation(request, response){
//   const getLocation = require('./data/location.json');
//   const city = request.query.city;
//   let obj = {
//     name: getLocation[0].display_name,
//     formatted_query: city,
//     city : city,
//     latitude: getLocation[0].lat,
//     longitude: getLocation[0].lon
//   };
//   response.send(obj);
// }

server.listen(PORT, ()=> console.log(`this is running on server ${PORT}`));