const SpotifyWebApi = require('spotify-web-api-node')
const auth = require('../config/spotifyConfig/spotifyToken')
const spotifyData = require('../../setSpotify')
const { setPlaylistAndTracks } = require('../../setPlaylistInfo')

let token = ''
const dictionary = {}

const spotifyApi = new SpotifyWebApi()

async function setTokenData () {
  token = auth.spotifyGetToken()
  spotifyApi.setAccessToken(token)
}

async function getMyData () {
  ;(async () => {
    setTokenData()
    const me = await spotifyApi.getMe()
    getUserPlaylists(me.body.id)
  })().catch((err) => {
    console.error(err)
  })
}

async function getUserPlaylists (user) {
  const data = await spotifyApi.getUserPlaylists(user)
  const playlists = []

  // For multiple playlist
  for (const playlist of data.body.items) {
    if (playlist.name === 'Kp') {
      playlists.push(playlist.name)
      const tracks = await getPlayListsTracks(playlist.id, playlist.name)
    }
  }
}

async function getPlayListsTracks (playlistID, playlistName) {
  const data = await spotifyApi.getPlaylistTracks(playlistID, {
    offset: 0,
    limit: 100,
    fields: 'items'
  })
  spotifyData.setData(data) // find out what this data is and why we are setting it to use it for later
  console.log(data)

  const tracks = []
  let count = 0
  for (const trackObj of data.body.items) {
    if (count === 2) {
      console.log('reaching 5 count limit')
      break
    }
    const track = trackObj.track
    tracks.push(track)
    const artist = track.artists[0].name
    const songName = track.name
    setPlaylistAndTracks(playlistName, `${songName} ${artist}`)
    count += 1
    // we're able to get all the songs and the artists to use globally
  }

  return tracks
}

module.exports = getMyData
// module.exports = getPlayListsTracks;
