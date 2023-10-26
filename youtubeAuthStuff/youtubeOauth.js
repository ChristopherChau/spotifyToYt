const express = require('express');
const authRoutes = require('./googleAuth');
const passport = require('passport');
const main = require('./google');
const ytAuth = require('./setToken');
const createYTPlaylist = require('./ytPlaylist');

require('./google');

const port = process.env.port || 5503;
const app = express();


function afterServerStart() {
  console.log('Server is up and running.');
  // console.log('Access Token:', ytAuth.getYoutubeToken());
  //this gets run right when we start the server

  // createYTPlaylist(ytAuth.getYoutubeToken(),'Test');

  // Export the access token (if needed)
  module.exports = ytAuth.getYoutubeToken();
}

async function bootstrap(callback) {
  app.use(passport.initialize());
  app.use('/api/auth', authRoutes);

  try {
    await app.listen(port);
    callback(); // Call the callback after server startup
  } catch (err) {
    console.log(err);
  }
}

// Call bootstrap with the afterServerStart callback
bootstrap(afterServerStart);
