const axios = require('axios')
const YT_API_KEY = process.env.YT_API_KEY
const ytAuth = require('../config/youtubeAuthConfig/youtubeToken')
require('dotenv').config()

// If we ever want to track quotas we can do this in here by incrementing quotas in every function

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function createYoutubePlaylist(playlistName, accessToken) {
  const data = {
    snippet: {
      title: playlistName,
      description: 'Playlist created from Spotify',
      defaultLanguage: 'en',
    },
    status: {
      privacyStatus: 'public',
    },
  }

  try {
    const response = await axios.post(
      'https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error(`Failed to create YouTube playlist: ${error}`)
    // You can throw the error again to let the caller handle it
    throw error
  }
}

async function getOwnPlaylists(accessToken) {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/playlists?part=id,snippet&mine=true',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response
  } catch (error) {
    console.error(`Failed to get YouTube playlists: ${error}`)
    throw error
  }
}

async function insertSongIntoPlaylist(playListID, resourceID, accessToken) {
  const data = {
    snippet: {
      playlistId: playListID, // Changed from playListId to playlistId
      resourceId: {
        kind: 'youtube#video',
        videoId: `${resourceID}`,
      },
    },
  }
  try {
    const response = await axios.post(
      'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,status,snippet',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error(`Failed to insert song into playlist: ${error}`)
    throw error
  }
}

async function searchOnYoutube(song) {
  try {
    const searchQuery = `${song} song lyrics`
    const YT_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YT_API_KEY}`
    const response = await axios.get(YT_API_URL, {
      headers: {
        Authorization: `Bearer ${ytAuth.youtubeGetToken()}`,
      },
    })

    const videoId = response.data.items[0].id.videoId
    return {
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    }
  } catch (err) {
    console.error(`Error searching ${song} on Youtube: ${err}`)
    return null
  }
}

module.exports = {
  createYoutubePlaylist,
  searchOnYoutube,
  getOwnPlaylists,
  insertSongIntoPlaylist,
  delay,
}
