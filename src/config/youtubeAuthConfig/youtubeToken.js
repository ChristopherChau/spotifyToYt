let accessToken = null

module.exports = {
  youtubeSetToken: function (token) {
    accessToken = token
  },
  youtubeGetToken: function () {
    return accessToken
  }
}
