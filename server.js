// server.js
// where your node app starts

// init project
require('dotenv').config();
const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const ipInfo = require('ipinfo');

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

app.get('/ipinfo', function(request, response) {
  ipInfo((err, cLoc) => {
    if (err) {
      return response.json(err);
    } else {
      response.json(cLoc);
    }
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
          response.redirect(302, o.image);
        }
      });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
