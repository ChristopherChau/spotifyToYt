const passport = require('passport')
const Strategy = require('passport-google-oauth20').Strategy
const ytAuth = require('./youtubeToken')
const { getPlaylistAndTracks } = require('../../../setPlaylistInfo')
const {
  searchOnYoutube,
  getOwnPlaylists,
  createYoutubePlaylist,
  insertSongIntoPlaylist,
} = require('../../services/youtubeService')

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      ytAuth.youtubeSetToken(accessToken)

      if (ytAuth.youtubeGetToken() != null) {
        const playlistsAndSongs = getPlaylistAndTracks()
        for (const playlistName in playlistsAndSongs) {
          const songs = playlistsAndSongs[playlistName]
          const createdPlaylistInfo = await createYoutubePlaylist(
            playlistName,
            ytAuth.youtubeGetToken(),
          )

          for (const songName of songs) {
            try {
              const songInfo = await searchOnYoutube(songName)
              await insertSongIntoPlaylist(
                createdPlaylistInfo.id,
                songInfo.videoId,
                ytAuth.youtubeGetToken(),
              )
            } catch (error) {
              console.error(`Error inserting song ${songName}:`, error)
            }
          }
        }
      }
      done(null, profile)
    },
  ),
)

module.exports = getOwnPlaylists
