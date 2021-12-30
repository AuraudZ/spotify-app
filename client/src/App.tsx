import "./App.css";
import { LoggedIn } from "./LoggedIn";

function App() {
  // get Token from url query string
  const token = new URLSearchParams(window.location.search).get("token");
  // if token is not present, redirect to login page
  if (!token) {
    <div className="App">
      <a href="http://localhost:3000/auth">Login</a>
    </div>;
  }
  return <LoggedIn />;
}

export default App;
