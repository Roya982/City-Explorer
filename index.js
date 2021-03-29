'use strict';

//load variable from .env

require('dotenv').config();

// server section

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const server = express();

const PORT = process.env.PORT;



server.use(cors());


// Location Section



server.get('/location', callLocation);


function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

const cachingLocation = {};

function callLocation(request, response) {
  let getLocation = request.query.city;
  const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
  if(cachingLocation[city]){
    response.send(cachingLocation[city]);
  }else{
    const locationUrl =`https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${getLocation}&format=json&limit=1`;
    superagent.get(locationUrl).then(res=>{

      const locDat = res.body[0];
      const location = new Location(getLocation, locDat);
      cachingLocation[getLocation] = location;
      response.send(location);

    }).catch(error=>{
      console.log('Error is happening here!!!');
      console.log(error);
    });
    }
}

// Weather section

const WEATHER_CODE_API_KEY = process.env.WEATHER_CODE_API_KEY;

server.get('/weather', callWeather);

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function callWeather(request, response) {
  let getWeather = request.query.search_query;
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  
  const weatherUrl =`https://api.weatherbit.io/v2.0/forecast/daily?city=${getWeather}&key=${WEATHER_API_KEY}`;
  superagent.get(weatherUrl).then(res=>{

    const weather = new Weather(res.weather.description, res.valid_date);
    response.send(weather);
  }).catch(error=>{
    console.log('Error is happening here!!!');
    console.log(error);
  });
  
}


//Parks section 

function Parks (name, address, fee, description, url) {
  this.name = name;
  this.address = address;
  this.fee = fee;
  this.description = description;
  this.url = url;
}


// Running server

server.listen(process.env.PORT , () =>console.log(`App is running on Server on port: 5000`));

//error handler

server.use('*', notFoundHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}