let data

function setData(dataFromAPI) {
  data = dataFromAPI
}

function getData() {
  return data
}

module.exports = {
  setData,
  getData,
}
