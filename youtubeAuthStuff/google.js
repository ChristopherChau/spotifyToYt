const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./setToken");
const spotifyData = require("../setSpotify");

const YT_API_KEY = "AIzaSyDEe56vgEU2DSR-3gVEVK0xsA3octKQFI4";

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

async function searchOnYoutube(song, artist) {
    try {
        const searchQuery = `${song} ${artist} song lyrics`;
        let YT_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YT_API_KEY}`;
        const response = await axios.get(YT_API_URL);

        const videoID = response.data.items[0].id.videoId;
        return {
            videoID,
            videoUrl: `https://www.youtube.com/watch?v=${videoID}`,
        };
    } catch (err) {
        console.error(`Error searching ${song} on Youtube: ${err}`);
        return null;
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
                    //so we want to go through the global dictionary and loop through all the keys
                    //for every key, we want to create a playlist then loop through the songs
                    //for every song, we insert the song into the playlist

                    playlists = await getOwnPlaylists(ytAuth.getToken()); //later this will be changed to the length of the spotify playlists
                    numberOfPlaylists = playlists.items.length;
                    for (let i = 0; i < numberOfPlaylists; i++) {
                        //loop through playlist songs and then search them up on youtube then add then to a playlist then we can loop over our spotify playlists and download them
                        console.log(playlists.items[i].id);
                    }

                    console.log(spotifyData.getData());
                    // videoInfo = await searchOnYoutube("", "New Jeans"); //search the song on youtube and then get its ID to add into given playlist
                    // await insertSongIntoPlaylist(
                    //     createdPlaylistInfo.id,
                    //     `${videoInfo.videoID}`,
                    //     ytAuth.getToken()
                    // );
                } catch (error) {
                    console.log(error);
                }
            }
            done(null, profile);
        }
    )
);
