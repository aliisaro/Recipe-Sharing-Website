import { Link } from "react-router-dom";
import img from "../images/Logo.png";
import Searchbar from "../components/Searchbar";

const Navbar = ({ setIsAuthenticated, isAuthenticated }) => {

  const handleClick = (e) => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

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
        {isAuthenticated && (
        <div>
          <span>Welcome, {localStorage.getItem('username')}</span>
            <button><Link to="/CreateRecipe">Create a Recipe</Link></button>
            <button><Link to="/Library">Library</Link></button>
            <button><Link to="/Profile">Profile</Link></button>
          <button onClick={handleClick}>Log out</button>
        </div>
        )}
        {!isAuthenticated && (<div>
            <button><Link to="/SignIn">Login</Link></button>
            <button><Link to="/SignUp">Signup</Link></button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
