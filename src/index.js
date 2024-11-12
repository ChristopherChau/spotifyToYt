// let SpotifyWebApi = require("spotify-web-api-node");
// const express = require("express");
// const getMyData = require("../src/services/spotifyService");
// const auth = require("./config/spotifyConfig/spotifyToken");
// const session = require("express-session");
// const authRoutes = require("./config/youtubeAuthConfig/googleAuth");
// const passport = require("passport");
// const ytAuth = require("./config/youtubeAuthConfig/youtubeToken");
// const { getPlaylistAndTracks } = require("../setPlaylistInfo");
// const { getOwnPlaylists } = require("../src/services/youtubeService");
// const { downloadPlaylist } = require("../SpotYTFuncs/download");
// const spotifyApi = require("./config/spotifyConfig/spotifyConfig");

// const scopes = [
//   "ugc-image-upload",
//   "user-read-playback-state",
//   "user-modify-playback-state",
//   "user-read-currently-playing",
//   "streaming",
//   "app-remote-control",
//   "user-read-email",
//   "user-read-private",
//   "playlist-read-collaborative",
//   "playlist-modify-public",
//   "playlist-read-private",
//   "playlist-modify-private",
//   "user-library-modify",
//   "user-library-read",
//   "user-top-read",
//   "user-read-playback-position",
//   "user-read-recently-played",
//   "user-follow-read",
//   "user-follow-modify",
// ];
// const port = process.env.PORT || 5501;
// const app = express();

// let accessToken = "";

// async function afterServerStart() {
//   console.log("Server is up and running.");
//   console.log(`Access token: ${ytAuth.youtubeGetToken()}`);
// }

// async function bootstrap(callback) {
//   app.use(
//     session({
//       secret: `${ytAuth.youtubeGetToken()}`, // replace with your own secret key
//       resave: false,
//       saveUninitialized: true,
//     })
//   );
//   //Initialize middleware that will allow us to handle authentication
//   app.use(passport.initialize());
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//       done(err, user);
//     });
//   });
//   //This will specify the routes that we can take and what to do when we go to these routes
//   app.use("/api/auth", authRoutes);

//   try {
//     app.listen(port);
//     callback(); // Call the callback after server startup
//   } catch (err) {
//     console.log(err);
//   }
// }

// // Call bootstrap with the afterServerStart callback
// bootstrap(afterServerStart);

// app.get("/login", (req, res) => {
//   res.redirect(spotifyApi.createAuthorizeURL(scopes));
// });

// app.get("/callback", (req, res) => {
//   //create path so that when users get to the callback path, the code below will run)
//   const error = req.query.error;
//   const code = req.query.code;

//   if (error) {
//     console.error("Callback Error:", error);
//     res.send(`Callback Error: ${error}`);
//     return;
//   }

//   spotifyApi
//     .authorizationCodeGrant(code)
//     .then((data) => {
//       accessToken = data.body["access_token"];
//       const refreshToken = data.body["refresh_token"];
//       const expiresIn = data.body["expires_in"];

//       spotifyApi.setAccessToken(accessToken);
//       spotifyApi.setRefreshToken(refreshToken);
//       console.log(accessToken);

//       auth.spotifySetToken(accessToken);

//       res.send("Successful");

//       setInterval(async () => {
//         const data = await spotifyApi.refreshAccessToken();
//         const accessTokenAgain = data.body["access_token"];
//         console.log(`Access token refreshed: ${accessTokenAgain}`);
//         spotifyApi.setAccessToken(accessTokenAgain);
//       }, (expiresIn / 2) * 1000);

//       getMyData(); //prior to this, we get the access and refresh tokens and we set them in the spotifyApi object and the auth.js file and then we get user data
//     })
//     .catch((err) => {
//       console.error(`Error getting tokens: ${err}`);
//       res.send(`Error getting tokens: ${err}\n`);
//     });
// });

// app.get("/getPlaylists", (req, res) => {
//   if (!accessToken) {
//     console.log("no token");
//     res.send("no token");
//   } else {
//     console.log("in playlist");
//     res.send("Successful");
//     getPlaylistAndTracks();
//   }
// });

// app.get("/downloadSongs", async (req, res) => {
//   let response = await getOwnPlaylists(ytAuth.youtubeGetToken());
//   for (let playlistName of response.items) {
//     if (playlistName.snippet.title === "Kp") {
//       let path = `./${playlistName.snippet.title}`;
//       let playlistURL = `https://www.youtube.com/playlist?list=${playlistName.id}`;
//       downloadPlaylist(path, playlistURL);
//     }
//   }
// });
// index.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./config/youtubeAuthConfig/googleAuth");
const ytAuth = require("./config/youtubeAuthConfig/youtubeToken");
const routes = require("./routes/routes"); // Import the routes

const port = process.env.PORT || 5501;
const app = express();

async function afterServerStart() {
  console.log("Server is up and running.");
  console.log(`Access token: ${ytAuth.youtubeGetToken()}`);
}

async function bootstrap(callback) {
  app.use(
    session({
      secret: `${ytAuth.youtubeGetToken()}`, // Replace with your own secret key
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

  app.use("/api/auth", authRoutes);
  app.use("/", routes); // Use the routes

  try {
    app.listen(port, callback);
  } catch (err) {
    console.log(err);
  }
}

bootstrap(afterServerStart);
