'use strict';

// server section

const express = require('express');
const cors = require('cors');

const server = express();

const PORT = 3000;

server.use(cors());


// Location Section

server.get('/location', callLocation);

function Location(input, searchQuery) {
  this.search_query = searchQuery.city;
  this.formatted_query = input.formatted_query;
  this.latitude = input.lat;
  this.longitude = input.lon;
}


function callLocation(request, response) {
  let getLocation = require('./data/location.json');

  const searchQuery = request.query.city
  const formattedQuery = getLocation[0]

  let myResponse = new Location(formattedQuery, searchQuery);
  
  response.send(myResponse);
}

// Weather section

server.get('/weather', callWeather);

function Weather(input) {
  this.forecast = input.Weather.description;
  this.time = input.valid_date;
}

function callWeather(request, response){
  const getWeather = require('./data/weather.json');

  const weatherArray =[];

  getWeather.data.forEach((element)=>{
    return weatherArray.push(new Weather(element));
  })
  response.send(weatherArray);
}


server.listen(PORT, ()=> console.log(`this is running on server ${PORT} ...`));