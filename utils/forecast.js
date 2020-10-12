require('dotenv').config();
const request = require('request');
const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY || '';
const forecast = (address, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${address}`;

  request({url, json: true}, (error, {body})=>{
    console.log(url);
    if (error) {
      callback('Error - Unable to connect to Weather Server!', undefined);
    } else if (body.error) {
      callback('Error - ' + body.error.info);
    } else {
      const {current, location} = body;
      callback(undefined, {
        location: location.name,
        country: location.country,
        description: current.weather_descriptions[0],
        temprature: current.temperature,
        feelslike: current.feelslike,
        icon: current.weather_icons[0],
        time: current.observation_time,
      });
    }
  });
};

module.exports = forecast;
