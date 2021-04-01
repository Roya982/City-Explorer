'use strict';

//load variable from .env

require('dotenv').config();

// server section
const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { query } = require('express');
const server = express();

const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);

server.use(cors());

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

client.on('error', err => console.log("PG PROBLEM!!!"));

// Running server

client.connect().then(() => {
  server.listen(process.env.PORT || PORT, () => {
      console.log('Server Start at ' + PORT + ' .... ');
  })
});


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

client.query('select * from location').then(data =>{
  data.rows.forEach(element=>{
    cachingLocation[element.search_query]=element
  });
});


let lat='';
let lon='';

function callLocation(request, response) {
  let city = request.query.city;
  const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
  if(cachingLocation[city]){
    response.send(cachingLocation[city]);
  }else{

    const SQL = `INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *`;

    const locationUrl =`https://us1.locationiq.com/v1/search.php?key=${LOCATION_API_KEY}&q=${city}&format=json&limit=1`;

    superagent.get(locationUrl).then(res=>{

      const locDat = res.body[0];
      const location = new Location(city, locDat);
      cachingLocation.lat = locDat.lat;
      cachingLocation.lon = locDat.lon;
      lat= locDat.lat;
      lon = locDat.lon;
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

  const SQL = 'INSERT INTO weather (valid_time, forecast) VALUES($1, $2) RETURNING *';

  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

  client.query('SELECT * FROM weather').then(data=>{
    if (data.rowCount === 0){
      superagent.get(weatherUrl).then(res=>{
      
      const momentWeather= res.body.data.map(element=>new Weather(element));
      console.log(momentWeather);
      
      response.send(momentWeather);
      
      }).catch(error=>{
      console.log('Error is happening here!!!');
      console.log(error);
      });
    }
    else{response.send(data.rows);}
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

  const SQL = 'INSERT  INTO parks (name, url, fee, description) VALUES($1, $2, $3, $4) RETURNING *';
  client.query('SELECT * FROM park').then(data =>{
    if (data.rowCount === 0){
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
  });

}


//error handler

server.use('*', notFoundHandler);

function notFoundHandler(request, response) {
  response.status(404).send('there is error here!!!');
}