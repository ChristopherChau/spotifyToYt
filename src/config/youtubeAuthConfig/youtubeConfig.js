const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const ytAuth = require("./youtubeToken");
const spotifyData = require("../../../setSpotify");
const { getPlaylistAndTracks } = require("../../../setPlaylistInfo");
const {
  searchOnYoutube,
  getOwnPlaylists,
  createYoutubePlaylist,
  insertSongIntoPlaylist,
  delay,
} = require("../../services/youtubeService");

const jwt = require('jsonwebtoken');

function decodeAccessToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  console.log('Decoded Access Token:', decoded);
}

// Decode the token
// decodeAccessToken(ytAuth.youtubeGetToken());

// passport.use(
//     new Strategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: process.env.GOOGLE_CALLBACK_URL,
//         scope: [
//           "email",
//           "profile",
//           "https://www.googleapis.com/auth/youtube",
//           "https://www.googleapis.com/auth/youtube.force-ssl",
//         ],
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         ytAuth.youtubeSetToken(accessToken);
  
//         if (ytAuth.youtubeGetToken() != null) {
//           let playlistsAndSongs = getPlaylistAndTracks();
//           for (let playlistName in playlistsAndSongs) {
//             let songs = playlistsAndSongs[playlistName];
//             let createdPlaylistInfo = await createYoutubePlaylist(
//               playlistName,
//               ytAuth.youtubeGetToken()
//             );
//             let delayTime = 5000; // Start with a 5 second delay
  
//             // for (let songName of songs) {
//             //   try {
//             //   let songInfo = await searchOnYoutube(songName);
//             //   await insertSongIntoPlaylist(
//             //     createdPlaylistInfo.id,
//             //     songInfo.videoId,
//             //     ytAuth.youtubeGetToken()
//             //   );
//             //   await delay(delayTime);
//             // } catch (error) {
//             //   console.log(`Error processing song ${songName}: ${error}`);
//             //   if (error.response && error.response.status === 403) {
//             //     delayTime += 2000; // Increase delay by 2 seconds
//             //     console.log(`Increasing delay to ${delayTime / 1000} seconds`);
//             //   }
//             // }
//         //   }
//         }
//       }
//       done(null, profile);
//     }
//   )
// );

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
            // // let delayTime = 5000; // Start with a 5 second delay
  
            // for (let songName of songs) {
            //   try {
            //     let songInfo = await searchOnYoutube(songName);
            //     await insertSongIntoPlaylist(
            //       // Your code to insert song into playlist
            //     );
            //   } catch (error) {
            //     console.error(`Error inserting song ${songName}:`, error);
            //   }
            // }
          }
        }
        done(null, profile);
      }
    )
  );

module.exports = getOwnPlaylists;
