// dictionaryModule.js
const dictionary = {}

function setPlaylistAndTracks (key, value) {
  if (dictionary[key]) {
    dictionary[key].push(value)
  } else {
    dictionary[key] = [value]
  }
}

function getPlaylistAndTracks () {
  return dictionary
}

module.exports = { setPlaylistAndTracks, getPlaylistAndTracks }
