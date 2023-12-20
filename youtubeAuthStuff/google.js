const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./setToken");

async function createYoutubePlaylist(playlistName, accessToken) {
    const data = {
        snippet: {
            title: playlistName,
            description: "Playlist created from Spotify",
            defaultLanguage: "en",
        },
        status: {
            privacyStatus: "private",
        },
    };

    try {
        const response = await axios.post(
            "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Failed to create YouTube playlist: ${error}`);
        // You can throw the error again to let the caller handle it
        throw error;
    }
}

passport.use(
    new Strategy(
        {
            clientID:
                "36943627344-9nvmr1ssaln2b61evcgjrujgstd81vav.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5502/api/auth/google/redirect",
            scope: [
                "email",
                "profile",
                "https://www.googleapis.com/auth/youtube",
                "https://www.googleapis.com/auth/youtube.force-ssl",
            ],
            //VARIABLES ABOVE MUST BE SET LIKE THAT BECAUSE IT IS PART OF STRATEGY CONSTRUCTOR
        },
        async (accessToken, refreshToken, profile, done) => {
            ytAuth.setToken(accessToken);
            console.log(`Access token: ${ytAuth.getToken()}`);
            if (ytAuth.getToken() != null) {
                try {
                    await createYoutubePlaylist("Test", ytAuth.getToken());
                    console.log("trying to create playlist");
                } catch (error) {
                    console.log(error);
                }
            }
            done(null, profile);
        }
    )
);
