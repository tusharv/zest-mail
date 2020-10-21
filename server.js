// server.js
// where your node app starts

// init project
require('dotenv').config();
const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const ipInfo = require('./utils/ip-info');
const forecast = require('./utils/forecast');
const fs = require('fs');
const text2png = require('text2png');
const userIP = require('./utils/getip');
const userData = require('./utils/getUserData');
const saveImage = require('./utils/saveImage');
const dateFormat = require('dateformat');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/mail', function(request, response) {
  const msg = {
    to: request.param('receiver-email'),
    from: request.param('sender-email'),
    subject: request.param('subject'),
    text: request.param('message'),
    html: request.param('message'),
  };
  sgMail.send(msg);

  response.send('Sent Mail Successfully to ' + request.param('receiver-email'));
});

app.get('/ipinfo/:ip?', function(request, response) {
  const {ip = ''} = request.params;
  ipInfo(ip, (data) => {
    response.json(data);
  });
});

app.get('/ip', function(request, response) {
  if (request.headers['x-forwarded-for']) {
    return response.json({
      ip: request.headers['x-forwarded-for'],
      type: 'header',
    });
  } else if (request.connection && request.connection.remoteAddress) {
    return response.json({
      ip: request.connection.remoteAddress,
      type: 'connection-remote-address',
    });
  } else if (request.socket && request.socket.remoteAddress) {
    return response.json({
      ip: request.socket.remoteAddress,
      type: 'socket-remote-address',
    });
  } else {
    return response.json({error: 'Unable to detect IP Address'});
  }
});

app.get('/weather/:address?', (req, res) => {
  const {address} = req.params;

  if (!address) {
    return res.send({
      error: 'Address param is missing',
    });
  }

  forecast(address, (error, forecastData) => {
    if (error) {
      return res.send({
        error,
        type: 'forecast',
      });
    }
    res.send({
      address: address,
      location: forecastData.location,
      country: forecastData.country,
      temprature: forecastData.temprature,
      feelslike: forecastData.feelslike,
      description: forecastData.description,
      icon: forecastData.icon,
      time: forecastData.time,
    });
  });
});

app.get('/text/:text?', function(request, response) {
  const {text = 'Hello World'} = request.params;
  const fileName = __dirname + '/public/images/' + text + '.png';

  fs.writeFileSync(fileName, text2png(text,
      {
        color: 'teal',
        backgroundColor: 'linen',
        lineSpacing: 10,
        padding: 20,
      }));
  response.sendFile(fileName);
});

app.get('/image/:category?', function(request, response) {
  const {category = 'Top Rated'} = request.params;
  const url = 'https://api.unsplash.com/photos/random?client_id=' + process.env.UNSPLASH_API_KEY + '&query=' + category;
  axios.get(url)
      .then(function(res) {
        if (res.data) {
          const data = res.data;
          const o = {
            image: data.urls.regular,
            color: data.color,
            description: data.description,
            name: data.user.name,
            link: data.user.links.html,
            timestamp: new Date() / 1000,
          };
          response.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'no-cache, max-age=0',
          });
          // response.redirect(302, o.image);
          response.redirect(o.image);
        }
      });
});

app.get('/zest/:key?/:value?', function(request, response) {
  const {key, value = ''} = request.params;
  const ipAddress = userIP(request);

  ipInfo(ipAddress.ip, (data) => {
    switch (key) {
      case 'location':
        return response.sendFile(saveImage(data.city));
        break;
      case 'text':
        return response.sendFile(saveImage(value));
        break;
      case 'time':
        const now = new Date();
        let dateTo; let diffrence;

        if (value) {
          dateTo = new Date(value);
          if (dateTo.toString() === 'Invalid Date') {
            return response.sendFile(saveImage('Invalid Date'));
          }
          diffrence = Math.round(((dateTo - now) / 1000 ) / (1));
          return response.sendFile(
              saveImage( Math.abs(diffrence) + ' seconds ' +
              ((diffrence > 0) ? 'remaining in ' : 'passed after ') +
                dateFormat(dateTo, 'mmmm dS yyyy'),
              ),
          );
        } else {
          return response.sendFile(
              saveImage(
                  dateFormat(now, 'dddd mmmm dS yyyy h:MM:ss TT'),
              ),
          );
        }
        break;
      case 'weather':
        forecast((value) ? value : data.city, (error, forecastData) => {
          if (error) {
            return response.send({
              error,
              type: 'forecast',
            });
          }
          return response.sendFile(
              saveImage(
                  forecastData.temprature + ' ' +forecastData.description,
              ));
        });
        break;
      case 'weather-icon':
        forecast((value) ? value : data.city, (error, forecastData) => {
          if (error) {
            return response.send({
              error,
              type: 'forecast',
            });
          }
          return response.redirect(forecastData.icon);
        });
        break;
      case 'user':
        if (!value) {
          return response.json({
            error: 'User id is missing',
          });
        }
        return response.sendFile(saveImage(userData(value)));
        break;
      default:
        return response.send('Something Random');
        break;
    }
  });
});

app.get('*', (request, response)=>{
  response.sendFile(__dirname + '/views/404.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
