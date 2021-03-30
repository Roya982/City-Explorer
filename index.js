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


// Running server

server.listen(process.env.PORT , () =>console.log(`App is running on Server on port: ${PORT}`));


// Location Section




const localLocation=[];

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
  localLocation.push(this);
}

server.get('/location', callLocation);

const cachingLocation = {};

function callLocation(request, response) {
  let getLocation = request.query.getLocation;
  const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
  if(cachingLocation[getLocation]){
    response.send(cachingLocation[getLocation]);
  }else{
    const locationUrl =`https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${getLocation}&format=json&limit=1`;
    superagent.get(locationUrl).then(res=>{

      const locDat = res.body[0];
      const location = new Location(getLocation, locDat);
      cachingLocation.lat = locDat.lat;
      cachingLocation.lon = locDat.lon;
      response.send(location);

    }).catch(error=>{
      console.log('Error is happening here!!!');
      console.log(error);
    });
    }
}

// Weather section



function Weather(item) {
  this.forecast = item.weather.description;
  this.time = item.valid_date;
}

server.get('/weather', callWeather);


function callWeather(request, response) {

  
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  
  const weatherUrl =`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}`;

  superagent.get(weatherUrl).then(res=>{
    
    const momentWeather= res.body.data.map(element=>{new Weather(element);})
    response.send(momentWeather);
  }).catch(error=>{
    console.log('Error is happening here!!!');
    console.log(error);
  });
  
}


//Parks section 

function Parks (item) {
  this.name = item.name;
  this.url = item.url;
}
const allParks = [];
server.get('/parks', callPark);

function callPark(request, response){
  const PARK_API_KEY = process.env.PARK_API_KEY;

  let parkUrl = `https://developer.nps.gov/api/v1/parks?parkCode=la&limit=10&api_key=${PARK_API_KEY}`;

  superagent.get(parkUrl).then(res=>{
    res.body.data.map(item=>{
      allParks.push(new Parks(item));
      return allParks;
    })
    response.send(allParks);
  }).catch(error=>{
    console.log('Error is happening here!!!');
    console.log(error);
  });

}


//error handler

server.use('*', notFoundHandler);

function notFoundHandler(request, response) {
  response.status(404).send('there is error here!!!');
}