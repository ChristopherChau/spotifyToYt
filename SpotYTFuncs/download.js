const fs = require("fs");
const {exec} = require('child_process');



async function createDirectory(path) {
  console.log('in createDirectory');
  
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      if (error) {
        fs.mkdir(path, (error) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            console.log("New Directory created successfully !!");
            resolve();
          }
        });
      } else {
        console.log("Given Directory already exists !!");
        resolve();
      }
    });
  });
}



async function downloadVideo(path,title,songURL){
  let outputDirectory = `--output "${path}/${title}.mp3"`
  const command = `/Users/christofur/documents/yt-dlp-stuff/yt-dlp_macos ${outputDirectory} --extract-audio --audio-format mp3 "${songURL}"`
  exec(command, (stdout, stderr, error) => {
    if (error){
      console.error(`Error: ${error}`);
      return;
    }
    if (stderr){
      console.log(stderr);
      return;
    }
    console.log(stdout);
  });
}



module.exports = createDirectory;
module.exports = downloadVideo;