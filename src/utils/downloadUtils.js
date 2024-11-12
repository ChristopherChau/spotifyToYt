const { exec } = require("child_process");

function downloadVideo(path, title, url) {
    const command = `/path/to/yt-dlp --output "${path}/${title}.mp3" --extract-audio --audio-format mp3 "${url}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) console.error(`Download Error: ${error}`);
        console.log(stdout);
    });
}

module.exports = { downloadVideo };
