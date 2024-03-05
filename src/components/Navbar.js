import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

function Navbar() {
  const {isLoggedIn, logOutUser} = useContext(AuthContext);

  return(
    <header>
      <Link to="/opinions" className="website-logo">TUHO-OPINION</Link>
      <input type="checkbox" id="menu-bar"></input>
      <label htmlFor="menu-bar">Menu</label>
      
      <nav className="navbar">
      <ul>
        <li><Link to="/">Account</Link>
          {isLoggedIn ?
          <ul>
            <li><Link onClick={logOutUser}>Log Out</Link></li>
          </ul>
          :
          <ul>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
          }
        </li>
      </ul>
    </nav>      
    </header>
  );
};

export default Navbar;