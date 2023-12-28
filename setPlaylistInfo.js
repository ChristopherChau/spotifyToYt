// dictionaryModule.js
let dictionary = {};

function setPlaylistAndTracks(key, value) {
    if (dictionary[key]) {
        dictionary[key].push(value);
    } else {
        dictionary[key] = [value];
    }
}

function getPlaylistAndTracks() {
    console.log(dictionary);
    return dictionary;
}

module.exports = { setPlaylistAndTracks, getPlaylistAndTracks };
