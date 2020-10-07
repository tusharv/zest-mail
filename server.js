// server.js
// where your node app starts

// init project
require('dotenv').config();
const express = require("express");
const app = express();
const sgMail = require("@sendgrid/mail");
const axios = require('axios');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/mail", function(request, response) {
  const msg = {
    to: request.param("email"),
    from: process.env.SENDER_MAIL,
    subject: request.param("subject"),
    text: request.param("message"),
    html: request.param("message")
  };
  sgMail.send(msg);
  
  response.send("Sent Mail Successfully to " + request.param("email"));
});


app.get("/image", function(request, response) {
  
  let url = 'https://api.unsplash.com/photos/random?client_id=' + process.env.UNSPLASH_API_KEY + '&query=Top rated';
  axios.get(url)
    .then(function (res) {
      if (res.data) {
        let data = res.data;
        let o = {
          image: data.urls.regular,
          color: data.color,
          description: data.description,
          name: data.user.name,
          link: data.user.links.html,
          timestamp: new Date()/1000
        };
        //response.json(o);
        // response.set({
        //   'Content-Type':'image/png',
        //   'Cache-Control':'no-cache, max-age=0'
        // });
        response.redirect(302, o.image);
        
      }
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
