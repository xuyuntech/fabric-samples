// SPDX-License-Identifier: Apache-2.0

// nodejs server setup

import routes from './routes';
// call the packages we need
const express = require('express');
// call express
const app = express(); // define our app using express
const bodyParser = require('body-parser');
const path = require('path');

// const http = require('http');
// const fs = require('fs');
// const Fabric_Client = require('fabric-client');
// const util = require('util');
// const os = require('os');


// Load all of our middleware
// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
  next();
});


// this line requires and runs the code from our routes.js file and passes it app
routes(app);

// set up a static file server that points to the "client" directory
app.use(express.static(path.join(__dirname, './client')));

// Save our port
const port = process.env.PORT || 8000;

// Start the server and listen on port
app.listen(port, () => {
  console.log(`Live on port: ${port}`);
});
