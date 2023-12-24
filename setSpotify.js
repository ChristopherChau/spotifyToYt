// setSpotify.js
let data;

function setData(dataFromAPI) {
    data = dataFromAPI;
}

function getData() {
    return data;
}

module.exports = {
    setData: setData,
    getData: getData,
};
