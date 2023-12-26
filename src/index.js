let SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const getMyData = require("../SpotYTFuncs/spotifyPlaylist");
const auth = require("./auth");
const session = require("express-session");
const authRoutes = require("../youtubeAuthStuff/googleAuth");
const passport = require("passport");
const main = require("../youtubeAuthStuff/google");
const ytAuth = require("../youtubeAuthStuff/setToken");
const { getPlaylistAndTracks } = require("../setPlaylistInfo");

const scopes = [
    "ugc-image-upload",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "app-remote-control",
    "user-read-email",
    "user-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-read-private",
    "playlist-modify-private",
    "user-library-modify",
    "user-library-read",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",
    "user-follow-read",
    "user-follow-modify",
];
const port = process.env.port || 5501;
const app = express();

let spotifyApi = new SpotifyWebApi({
    clientId: "f0b88a30739c41fba231326afc7d0d15",
    clientSecret: "0d74c82a2ddf411d9feae9b410c772bd",
    redirectUri: `http://localhost:${port}/callback`,
});

let accessToken = "";

app.get("/login", (req, res) => {
    //create path so when users go to login path, the code below will run (user is redirected to that website)
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get("/callback", (req, res) => {
    //create path so that when users get to the callback path, the code below will run)
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error("Callback Error:", error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then((data) => {
            accessToken = data.body["access_token"];
            const refreshToken = data.body["refresh_token"];
            const expiresIn = data.body["expires_in"];

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            auth.setToken(accessToken);

            res.send("Successful");

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const accessTokenAgain = data.body["access_token"];
                console.log(`Access token refreshed: ${accessTokenAgain}`);
                spotifyApi.setAccessToken(accessTokenAgain);
            }, (expiresIn / 2) * 1000);

            getMyData(); //prior to this, we get the access and refresh tokens and we set them in the spotifyApi object and the auth.js file and then we get user data
        })
        .catch((err) => {
            console.error(`Error getting tokens: ${err}`);
            res.send(`Error getting tokens: ${err}\n`);
        });
});

app.get("/getPlaylists", (req, res) => {
    if (!accessToken) {
        console.log("no token");
        res.send("no token");
    } else {
        console.log("in playlist");
        res.send("Successful");
        getPlaylistAndTracks();
    }
});

app.get("/downloadSongs", (req, res) => {
    const code = req.query.code;
    const error = req.query.error;
    if (error) {
        console.error("Callback Error:", error);
        res.send(`Callback Error: ${error}`);
        return;
    } else {
        (async () => {
            let dictionary = await getPlaylistAndTracks();
            for (let playlist in dictionary) {
                for (let songName in playlist) {
                    // import below but basically we want to go thru every song in the playlist and search up the song and artist which is the value of the key and then we create a path of the playlist and download it
                    // let songInfo = await searchOnYoutube(songName);
                    // let path = `./${playlist}`;
                    // downloadVideo(path, songName, songInfo.videoUrl);
                }
            }
        })();
    }
});

async function afterServerStart() {
    console.log("Server is up and running.");
    console.log(`Access token: ${ytAuth.getToken()}`);
}

async function bootstrap(callback) {
    app.use(
        session({
            secret: `${ytAuth.getToken()}`, // replace with your own secret key
            resave: false,
            saveUninitialized: true,
        })
    );
    //Initialize middleware that will allow us to handle authentication
    app.use(passport.initialize());
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    //This will specify the routes that we can take and what to do when we go to these routes
    app.use("/api/auth", authRoutes);

    try {
        app.listen(port);
        callback(); // Call the callback after server startup
    } catch (err) {
        console.log(err);
    }
}

// Call bootstrap with the afterServerStart callback
bootstrap(afterServerStart);
