const fs = require('fs')
const { exec } = require('child_process')

async function createDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      if (error) {
        fs.mkdir(path, (error) => {
          if (error) {
            console.error(error)
            reject(error)
          } else {
            resolve()
          }
        })
      } else {
        console.log('Given Directory already exists')
        resolve()
      }
    })
  })
}

async function downloadVideo(path, title, songURL) {
  let outputDirectory = `--output "${path}/${title}.mp3"`
  if (fs.existsSync(outputDirectory)) {
    console.log(`File ${title}.mp3 already exists. Skipping download.`)
    return
  }
  const command = `/Users/christofur/documents/yt-dlp-stuff/yt-dlp_macos ${outputDirectory} --extract-audio --audio-format mp3 "${songURL}"`
  exec(command, (stdout, stderr, error) => {
    if (error) {
      console.error(`Error: ${error}`)
      return
    }
    if (stderr) {
      console.log(stderr)
      return
    }
    console.log(stdout)
  })
}

async function downloadPlaylist(path, playlistURL) {
  await createDirectory(path)
  const command = `/Users/christofur/documents/yt-dlp-stuff/yt-dlp_macos --output "${path}/%(title)s.%(ext)s" --yes-playlist -i --extract-audio --audio-format mp3 "${playlistURL}"`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`)
      return
    }
    if (stderr) {
      console.log(stderr)
      return
    }
    console.log(stdout)
  })
}

module.exports = { createDirectory, downloadVideo, downloadPlaylist }
