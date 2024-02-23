import { Link } from "react-router-dom";
import img from "../images/Logo.png";
import Searchbar from "../components/Searchbar";
import React from "react";

const Navbar = ({ loggedIn, handleSignOut }) => {
  return (
    <nav className="navbar">
      <div className="item" style={{ flexGrow: 1 }}>
        <Link to="/">
          <img src={img} className="logo" alt="logo" />
        </Link>
      </div>

      <div className="item" style={{ flexGrow: 8 }}>
        <Searchbar />
      </div>

      <div className="item" style={{ flexGrow: 1 }}>
        {loggedIn ? (
          <button onClick={handleSignOut}>Sign out</button>
        ) : (
          <button><Link to="/SignIn">Sign in</Link></button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
