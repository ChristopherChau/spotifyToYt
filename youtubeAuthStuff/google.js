const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


// Configuration for Passport and the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: process.env.GOOGLE_SCOPE.split(' '),
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      // ytAuth.setYoutubeToken(accessToken);
      // console.log(ytAuth.getYoutubeToken());
      done(null, profile);
    }
  )
);

// Other configuration, routes, and middleware can be added here

// Start the server
const PORT = process.env.port || 6601; // Use the desired port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

