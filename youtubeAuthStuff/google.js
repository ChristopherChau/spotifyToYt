const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./setToken");
const spotifyData = require("../setSpotify");
const YT_API_KEY = "AIzaSyDEe56vgEU2DSR-3gVEVK0xsA3octKQFI4";
const { getPlaylistAndTracks } = require("../setPlaylistInfo");

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

async function searchOnYoutube(song) {
    try {
        const searchQuery = `${song} song lyrics`;
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
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

            // if (ytAuth.getToken() != null) {
            //     try {
            //         let playlistsAndSongs = getPlaylistAndTracks();
            //         for (let playlistName in playlistsAndSongs) {
            //             let songs = playlistsAndSongs[playlistName];
            //             let createdPlaylistInfo = await createYoutubePlaylist(
            //                 playlistName,
            //                 ytAuth.getToken()
            //             );
            //             for (let songName of songs) {
            //                 let songInfo = await searchOnYoutube(songName);
            //                 insertSongIntoPlaylist(
            //                     createdPlaylistInfo.id,
            //                     songInfo.videoID,
            //                     ytAuth.getToken()
            //                 );
            //                 await delay(1000);
            //             }
            //         }
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
            done(null, profile);
        }
    )
);

module.exports = getOwnPlaylists;
