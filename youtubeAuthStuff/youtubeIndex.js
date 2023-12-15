const express = require('express');
const authRoutes = require('./googleAuth');
const passport = require('passport');
const main = require('./google');
const ytAuth = require('./setToken');
// const createYTPlaylist = require('./ytPlaylist');

require('./google');

const port = process.env.port || 5502;
const app = express();


function afterServerStart() {
  console.log('Server is up and running.');
  console.log('Access Token:', ytAuth.getYoutubeToken());
  // createYTPlaylist(ytAuth.getYoutubeToken(),'Test');

  // Export the access token (if needed)
  // module.exports = ytAuth.getYoutubeToken();
}

async function bootstrap(callback) {
  //Initialize middleware that will allow us to handle authentication
  app.use(passport.initialize());
  //This will specify the routes that we can take and what to do when we go to these routes 
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