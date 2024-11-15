const SpotifyWebApi = require('spotify-web-api-node')
const auth = require('../config/spotifyConfig/spotifyToken')
const spotifyData = require('../globalDicts/setSpotify')
const { setPlaylistAndTracks } = require('../globalDicts/setPlaylistInfo')

let token = ''

const spotifyApi = new SpotifyWebApi()

async function setTokenData() {
  token = auth.spotifyGetToken()
  spotifyApi.setAccessToken(token)
}

async function getMyData() {
  ;(async () => {
    setTokenData()
    const me = await spotifyApi.getMe()
    getUserPlaylists(me.body.id)
  })().catch((err) => {
    console.error(err)
  })
}

async function getUserPlaylists(user) {
  const data = await spotifyApi.getUserPlaylists(user)
  const playlists = []

  // For multiple playlist
  for (const playlist of data.body.items) {
    if (playlist.name === 'Kp') {
      //This is set to a specific playlist since we have limited quotas
      playlists.push(playlist.name)
      // eslint-disable-next-line no-unused-vars
      const tracks = await getPlayListsTracks(playlist.id, playlist.name)
    }
  }
}

async function getPlayListsTracks(playlistID, playlistName) {
  const data = await spotifyApi.getPlaylistTracks(playlistID, {
    offset: 0,
    limit: 100,
    fields: 'items',
  })
  spotifyData.setData(data)

  const tracks = []
  let count = 0
  for (const trackObj of data.body.items) {
    if (count === 2) {
      //This is to limit the number of songs since we have limited quotas, change for real use
      break
    }
    const track = trackObj.track
    tracks.push(track)
    const artist = track.artists[0].name
    const songName = track.name
    setPlaylistAndTracks(playlistName, `${songName} ${artist}`)
    count += 1
  }

  return tracks
}

module.exports = getMyData
