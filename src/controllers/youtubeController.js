const { searchOnYoutube } = require("../services/youtubeService");

async function downloadYoutubeVideos(req, res) {
    try {
        const { playlistName, tracks } = req.body;  // Assume data is sent from client
        for (const track of tracks) {
            const video = await searchOnYoutube(track.name);
            if (video) {
                console.log(`Found video: ${video.videoUrl}`);
            }
        }
        res.send(`Downloaded videos for ${playlistName}`);
    } catch (err) {
        console.error("Error downloading videos:", err);
        res.status(500).send("Download error");
    }
}

module.exports = { downloadYoutubeVideos };
