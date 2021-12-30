import { useEffect, useState } from "react";

var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi();
export const LoggedIn = () => {
  const [data, setData] = useState();

  const token = new URLSearchParams(window.location.search).get("token");
  spotifyApi.setAccessToken(token);
  useEffect(() => {
    async function fetchData() {
      const data = await getUserProfile();
      setData(data.body);
    }
    fetchData();
  }, []);
  // Async function to get the user's profile
  const getUserProfile = async () => {
    const data = await spotifyApi.getMe();
    return data;
  };

  return (
    <div className="App">
      <h1>Logged In</h1>
      <p>You are logged in as {JSON.stringify(data)}</p>
    </div>
  );
};
