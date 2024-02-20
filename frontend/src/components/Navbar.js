import { Link } from "react-router-dom";
import img from "../images/Logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={img} className="nav-logo" alt="logo" />
      </Link>
      <ul>
        <li>
          <Link to="/SignIn">Sign in</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
