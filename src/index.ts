import axios from "axios";
import express from "express";
import path from "path";
import qs from "qs";
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
import SpotifyWebApi from "spotify-web-api-node";
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = "http://localhost:3000/callback";
let token = "";
const app = express();
const scopes = [
  // Allow all available scopes
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-read-private",
  "playlist-modify-public",
  "user-follow-modify",
  "user-follow-read",
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-library-modify",
  "user-library-read",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
];
app.get("/", (req, res) => {
  // Server index.html
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/auth", (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`
  );
});

app.get("/callback", (req, res) => {
  const code: any = req.query.code;
  // Convert code to access token
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    )}`,
  };

  const url = "https://accounts.spotify.com/api/token";
  const data = qs.stringify({
    code: code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  // Post request to get access token using axios
  axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      token = response.data.access_token;
      res.redirect(`/user?token=${token}`);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/user", async (req, res) => {
  const code: any = req.query.token;
  var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  });
  spotifyApi.setAccessToken(code);
  if (code) {
    const data = await spotifyApi.getMe();
    spotifyApi.getUserPlaylists(data.display_name).then(
      function (data) {
        res.send(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
        res.send(err);
      }
    );
  }

  spotifyApi.getMyTopArtists().then(
    function (data) {
      let topArtists = data.body.items;
      for (let i = 0; i < topArtists.length; i++) {
        console.log(topArtists[i].name);
      }
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );

  /* Get a User’s Top Tracks*/
  spotifyApi.getMyTopTracks().then(
    function (data) {
      let topTracks = data.body.items;
      for (let i = 0; i < topTracks.length; i++) {
        console.log(
          "Artist: " +
            topTracks[i].artists[0].name +
            "\nSong: " +
            topTracks[i].name +
            "\nAlbum: " +
            topTracks[i].album.name +
            "\n"
        );
      }
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
