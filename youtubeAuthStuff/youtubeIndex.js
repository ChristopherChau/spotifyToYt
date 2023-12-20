const express = require("express");
const authRoutes = require("./googleAuth");
const passport = require("passport");
const main = require("./google");
const ytAuth = require("./setToken");
const axios = require("axios");

require("./google");

const port = process.env.port || 5502;
const app = express();

// async function createYoutubePlaylist(playlistName, accessToken) {
//     const data = {
//         snippet: {
//             title: playlistName,
//             description: "Playlist created from Spotify",
//             defaultLanguage: "en",
//         },
//         status: {
//             privacyStatus: "private",
//         },
//     };

//     const response = await axios.post(
//         "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
//         data,
//         {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         }
//     );

//     return response.data;
// }

function afterServerStart() {
    console.log("Server is up and running.");
    console.log("Access Token:", ytAuth.getYoutubeToken());

    // createYoutubePlaylist("Test", ytAuth.getYoutubeToken());
}

async function bootstrap(callback) {
    //Initialize middleware that will allow us to handle authentication
    app.use(passport.initialize());
    //This will specify the routes that we can take and what to do when we go to these routes
    app.use("/api/auth", authRoutes);

    try {
        await app.listen(port);
        callback(); // Call the callback after server startup
    } catch (err) {
        console.log(err);
    }
}

// Call bootstrap with the afterServerStart callback
bootstrap(afterServerStart);
