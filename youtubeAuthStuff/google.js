const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


// Configuration for Passport and the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '36943627344-9nvmr1ssaln2b61evcgjrujgstd81vav.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5502/api/auth/google/redirect',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl'],
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
const PORT = process.env.PORT || 5503; // Use the desired port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

