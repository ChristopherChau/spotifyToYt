let accessToken = '';

function setYoutubeToken(token){
  accessToken = token;
}

function getYoutubeToken(){
  return accessToken;
}

module.exports = {
  setYoutubeToken,
  getYoutubeToken,
};