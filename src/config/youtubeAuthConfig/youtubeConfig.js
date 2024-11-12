const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./youtubeToken");
const spotifyData = require("../../../setSpotify");
const YT_API_KEY = process.env.YT_API_KEY;
const { getPlaylistAndTracks } = require("../../../setPlaylistInfo");
const searchOnYoutube = require("../../services/youtubeService");
const getOwnPlaylists = require("../../services/youtubeService");
const createYoutubePlaylist = require("../../services/youtubeService");

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      ytAuth.youtubeSetToken(accessToken);

      if (ytAuth.youtubeGetToken() != null) {
        let playlistsAndSongs = getPlaylistAndTracks();
        for (let playlistName in playlistsAndSongs) {
          let songs = playlistsAndSongs[playlistName];
          let createdPlaylistInfo = await createYoutubePlaylist(
            playlistName,
            ytAuth.youtubeGetToken()
          );
          let delayTime = 5000; // Start with a 5 second delay

          for (let songName of songs) {
            try {
              let songInfo = await searchOnYoutube(songName);
              await insertSongIntoPlaylist(
                createdPlaylistInfo.id,
                songInfo.videoId,
                ytAuth.youtubeGetToken()
              );
              await delay(delayTime);
            } catch (error) {
              console.log(`Error processing song ${songName}: ${error}`);
              if (error.response && error.response.status === 403) {
                delayTime += 2000; // Increase delay by 2 seconds
                console.log(`Increasing delay to ${delayTime / 1000} seconds`);
              }
            }
          }
        }
      }
      done(null, profile);
    }
  )
);

module.exports = getOwnPlaylists;
