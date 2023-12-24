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
async function getOwnPlaylists(accessToken) {
    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/playlists?part=id,snippet&mine=true",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Failed to get YouTube playlists: ${error}`);
        throw error;
    }
}
async function insertSongIntoPlaylist(playListID, resourceID, accessToken) {
    const data = {
        snippet: {
            playlistId: playListID, // Changed from playListId to playlistId
            resourceId: {
                kind: "youtube#video",
                videoId: `${resourceID}`,
            },
        },
    };
    try {
        const response = await axios.post(
            "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,status,snippet",
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
        console.error(`Failed to insert song into playlist: ${error}`);
        throw error;
    }
}

passport.use(
    new Strategy(
        {
            clientID:
                "36943627344-9nvmr1ssaln2b61evcgjrujgstd81vav.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5501/api/auth/google/redirect",
            scope: [
                "email",
                "profile",
                "https://www.googleapis.com/auth/youtube",
                "https://www.googleapis.com/auth/youtube.force-ssl",
            ],
        },
        async (accessToken, refreshToken, profile, done) => {
            ytAuth.setToken(accessToken);
            console.log(ytAuth.getToken());

            if (ytAuth.getToken() != null) {
                try {
                    playlists = await getOwnPlaylists(ytAuth.getToken());
                    // numberOfPlaylists = playlists.items.length;
                    // console.log(playlists.items[0].id);
                    await insertSongIntoPlaylist(
                        playlists.items[0].id,
                        "x8RIixqumUc",
                        ytAuth.getToken()
                    );

                    // for (let i = 0; i < numberOfPlaylists; i++) { //loop through playlists
                    //     console.log(playlists.items[i].id);

                    // }
                    // await createYoutubePlaylist("KPop", ytAuth.getToken());
                } catch (error) {
                    console.log(error);
                }
            }
            done(null, profile);
        }
    )
);
