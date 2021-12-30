import { useEffect, useState } from "react";
import { IUser } from "./utils/interfaces";
import "./loggedIn.css";

var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi();
export const LoggedIn = () => {
  const [user, setUser] = useState<IUser>(() => {
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
  const [playlists, setPlaylists] = useState<any[]>([]);

  const token = new URLSearchParams(window.location.search).get("token");
  spotifyApi.setAccessToken(token);
  useEffect(() => {
    async function fetchData() {
      const data = await getUserProfile();
      const playlists = await getUserPlaylists();
      setPlaylists(playlists.body.items);
      console.log(playlists.body.items);
      console.log(data.body);

      setUser(data.body);
    }
    fetchData();
  }, []);
  const getUserProfile = async () => {
    const data = await spotifyApi.getMe();
    data.body.display_name = data.body.display_name.replace(/\s/g, "");
    return data;
  };
  const getUserPlaylists = async () => {
    const data = await spotifyApi.getUserPlaylists();
    return data;
  };
  return (
    <div className="App">
      <h1>Logged In as {JSON.stringify(user.display_name)} </h1>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <h2>
            {playlist.name}
            <a href={playlist.external_urls.spotify} />
          </h2>
          <p>{playlist.description}</p>
          <img
            src={playlist.images[0].url}
            alt="playlist"
            width={100}
            height={100}
          />
        </div>
      ))}
    </div>
  );
};
