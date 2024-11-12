const axios = require("axios");
const { YT_API_KEY } = require("../config/youtubeConfig");

async function searchOnYoutube(song) {
    const searchQuery = `${song} song lyrics`;
    const YT_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YT_API_KEY}`;
    const response = await axios.get(YT_API_URL);
    const videoID = response.data.items[0].id.videoId;
    return {
        videoID,
        videoUrl: `https://www.youtube.com/watch?v=${videoID}`,
    };
}

module.exports = { searchOnYoutube };


const axios = require("axios");
const passport = require("passport");
const Strategy = require("passport-google-oauth20").Strategy;
const VerifyCallback = require("passport-google-oauth20").VerifyCallback;
const Profile = require("passport-google-oauth20").Profile;
const ytAuth = require("./setToken");
const spotifyData = require("../setSpotify");
const tokenHandler = require("../src/middlewares/tokenHandler");
require('dotenv').config();

const YT_API_KEY = process.env.YT_API_KEY;
const { getPlaylistAndTracks } = require("../setPlaylistInfo");

let quotas = 0;

async function createYoutubePlaylist(playlistName, accessToken) {
    const data = {
        snippet: {
            title: playlistName,
            description: "Playlist created from Spotify",
            defaultLanguage: "en",
        },
        status: {
            privacyStatus: "public",
        },
    };

    try {
        const response = await axios.post(
            "https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        quotas += 50;
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
        quotas += 1;
        return response;
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
    quotas += 50;
}

async function searchOnYoutube(song) {
    try {
        const searchQuery = `${song} song lyrics`;
        let YT_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YT_API_KEY}`;
        const response = await axios.get(YT_API_URL, {
            headers: {
                Authorization: `Bearer ${ytAuth.getToken()}`,
            },
        });

        const videoId = response.data.items[0].id.videoId;
        quotas += 100;
        return {
            videoId,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
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
            ytAuth.setToken(accessToken);

            if (ytAuth.getToken() != null) {
                let playlistsAndSongs = getPlaylistAndTracks();
                for (let playlistName in playlistsAndSongs) {
                    let songs = playlistsAndSongs[playlistName];
                    let createdPlaylistInfo = await createYoutubePlaylist(
                        playlistName,
                        ytAuth.getToken()
                    );
                    let delayTime = 5000; // Start with a 5 second delay

                    for (let songName of songs) {
                        try {
                            let songInfo = await searchOnYoutube(songName);
                            await insertSongIntoPlaylist(
                                createdPlaylistInfo.id,
                                songInfo.videoId,
                                ytAuth.getToken()
                            );
                            await delay(delayTime);
                        } catch (error) {
                            console.log(
                                `Error processing song ${songName}: ${error}. Video ID: ${songInfo.videoId}}`
                            );
                            if (
                                error.response &&
                                error.response.status === 403
                            ) {
                                delayTime += 2000; // Increase delay by 2 seconds
                                console.log(
                                    `Increasing delay to ${
                                        delayTime / 1000
                                    } seconds`
                                );
                            }
                        }
                    }
                }
                console.log(`total quotas used: ${quotas}`);
            }
            done(null, profile);
        }
    )
);

module.exports = getOwnPlaylists;
