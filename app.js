// Global Imports
const express = require('express');
require('dotenv').config();

// Local Imports
const { expressInit } = require('./modules/init/express');
const rootRoute = require('./routes/root');

// Express Setup
const app = express();
expressInit(app);

// Express routes
app.use('/', rootRoute);

// HTTP address/port for our web app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});
