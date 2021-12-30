import { useEffect, useState } from "react";

var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi();
interface IUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  images: string[];
  product: string;
  type: string;
  uri: string;
}
export const LoggedIn = () => {
  const [data, setData] = useState<IUser>(() => {
    return {
      id: "",
      display_name: "",
      email: "",
      country: "",
      images: [],
      product: "",
      type: "",
      uri: "",
    };
  });

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
      <p>You are logged in as {JSON.stringify(data.display_name)}</p>
    </div>
  );
};
