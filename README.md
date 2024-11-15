# Spotify to YouTube Converter 
<div align="center">
  [![Spotify](https://img.shields.io/badge/Spotify-1ED760?&style=for-the-badge&logo=spotify&logoColor=white)](https://spotify.com) :arrow_right: [![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)
</div>



## Overview
The Spotify to YouTube Converter is a tool that allows users to seamlessly transfer their Spotify playlists to YouTube playlists. By logging into their Spotify and YouTube accounts, users can easily create YouTube playlists containing the same songs as their Spotify playlists.

## Why I Built This Project

I built this project for several reasons:

- **Interest in API Integration**: I was intrigued by the idea of integrating APIs into my projects and wanted to gain hands-on experience with them. This project provided the perfect opportunity for me to explore API usage in a practical context.

- **Personal Usefulness**: As a college student I wanted to save money on music subscriptions but still listen to music without listening to ads. I had all my playlists and songs on Spotify so creating a tool that could facilitate the transfer of playlists from Spotify to YouTube to my local device seemed like a practical solution to this problem.

- **Learning Experience**: Developing this project not only helped me achieve my goal of saving money on music subscriptions but also served as a valuable learning experience. Through building this tool, I familiarized myself with API integration, user authentication processes, and working with web services.

## Features
- **Spotify Authentication**: Users log into their Spotify account via a defined route that will grab their playlists (currently we must define the hardcode the playlist we want as our APIs have limited quotas)
- **YouTube Authentication**: Users log into their YouTube account via Google OAuth to authorize song searching, playlist retrieval, and playlist creation.
- **Playlist Conversion**: Convert Spotify playlists into YouTube playlists.
- **Local Download**: Download the converted YouTube playlists onto your local machine.

## Tools Used
- Spotify Web API
- YouTube Data API
- Google OAuth client library

