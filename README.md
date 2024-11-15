# Spotify to YouTube Converter

## Overview
The Spotify to YouTube Converter is a tool that allows users to seamlessly transfer their Spotify playlists to YouTube playlists. By logging into their Spotify and YouTube accounts, users can easily create YouTube playlists containing the same songs as their Spotify playlists.

## Why I Built This Project

I built this project for several reasons:

- **Interest in API Integration**: I was intrigued by the idea of integrating APIs into my projects and wanted to gain hands-on experience with them. This project provided the perfect opportunity for me to explore API usage in a practical context.

- **Personal Usefulness**: As a music enthusiast, I often found myself wanting to save money on music subscriptions while still enjoying my favorite tunes. Creating a tool that could facilitate the transfer of playlists from Spotify to YouTube seemed like a practical solution to this problem.

- **Learning Experience**: Developing this project not only helped me achieve my goal of saving money on music subscriptions but also served as a valuable learning experience. Through building this tool, I familiarized myself with API integration, user authentication processes, and the intricacies of working with web services.

Overall, this project has been both personally beneficial and educational, allowing me to enhance my skills while solving a real-world problem that I encountered in my daily life.


## Features
- **Spotify Authentication**: Users log into their Spotify account via a provided link to access their playlists and songs.
- **YouTube Authentication**: Users log into their YouTube account via Google OAuth to authorize playlist creation.
- **Playlist Conversion**: Convert Spotify playlists into YouTube playlists.
- **Local Download**: Download the converted YouTube playlists onto your local machine.

## Usage
1. **Spotify Authentication**:
   - Visit [link] to log into your Spotify account.
   - Authorize the application to access your Spotify playlists and songs.

2. **YouTube Authentication**:
   - Visit [link] to log into your YouTube account through Google OAuth.
   - Authorize the application to create playlists on your YouTube account.

3. **Convert Playlists**:
   - Make a GET request to the specific path [/convert] to initiate playlist conversion.
   - The application will search all songs in your Spotify playlists and create corresponding YouTube playlists.

4. **Download Playlists**:
   - Once conversion is complete, the YouTube playlists will be available for download.
   - Download the converted YouTube playlists onto your local machine for offline access.

## Tools Used
- Spotify Web API
- Google OAuth client library

