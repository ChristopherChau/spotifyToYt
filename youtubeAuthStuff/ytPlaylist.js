const ytAuth = require('./setToken');
const axios = require('axios');

async function createYTPlaylist(accessToken, playlistName) {
  const playlistData = {
    part: "snippet,status",
    resource: {
      snippet: {
        title: "Test",
        description: "This is a description for my playlist.",
      },
      status: {
        privacyStatus: "public",
      },
    },
  };

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post('https://www.googleapis.com/youtube/v3/playlists', playlistData, {
      headers,
    });
    console.log('Playlist created successfully:', response.data);
  } catch (error) {
    console.error('Error creating playlist:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

module.exports = createYTPlaylist;

// module.exports = testingToken;