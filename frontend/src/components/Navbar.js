import { Link } from "react-router-dom";
import img from "../images/Logo.png";

const Navbar = ({ setIsAuthenticated, isAuthenticated}) => {
  const handleClick = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const username = localStorage.getItem("username");

  return (
    <nav className="navbar">
      <div className="item" style={{ flexGrow: 1 }}>
        <Link to="/">
          <img src={img} className="logo" alt="logo" />
        </Link>
      </div>

      <div className="item" style={{ flexGrow: 1 }}>
        {isAuthenticated && (
          <div>
            <button>
              <Link to="/CreateRecipe">Create </Link>
            </button>
            <button>
              <Link to="/Library">Library</Link>
            </button>
            <button>
              <Link to={`/profile/${username}`}>Profile</Link>
            </button>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
