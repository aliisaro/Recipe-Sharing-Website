import { Link } from "react-router-dom";
import React, { useState } from "react";
import img from "../images/Logo.png";


const Navbar = ({ setIsAuthenticated, isAuthenticated}) => {
  // State to manage the menu open/close state
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  // Function to handle logout
  const handleClick = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

 return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={img} className="logo" alt="logo" />
        </Link>
      </div>

      {isAuthenticated && (
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      )}

      {isAuthenticated && (
        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <Link to="/CreateRecipe" onClick={() => setMenuOpen(false)}>Create New Recipe</Link>
          <Link to="/Library" onClick={() => setMenuOpen(false)}>Library</Link>
          <Link to={`/profile/${username}`} onClick={() => setMenuOpen(false)}>Profile</Link>
          <button className="logout" onClick={handleClick}>Log out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
