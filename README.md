Go to localhost{port}/login then go to .../api/auth/google

then from there the program will search songs and download them. (set playlist in spotifyplaylist.js) then go to postman to do /downloadSongs

The download process will happen while we are in the loading after logging in? 

However i curre tly did the download songs in postman and it started downloading songs so i think the download songs is to download after we get the playlist 

we didnt call getmydata in the callback so we need to make sure we do that 


so once you log into spotify thru the /login, you get all the spotify information, from there we go into the google auth and once we verify a user, thats where we a create a playlist on youtiube and thats where we are loading. then we go to download songs to download songs and thats when we download the playlist on yt 