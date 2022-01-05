import axios from "axios";
import express from "express";
import qs from "qs";
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
import cors from "cors";
const clientSecret = process.env.CLIENT_SECRET;
const clientURL = "http://localhost:3001";
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
app.use(cors());

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
  axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      token = response.data.access_token;
      console.log(token);
      res.redirect("/token");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/token", (req, res) => {
  res.redirect(`${clientURL}?token=${token}`);
});
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
