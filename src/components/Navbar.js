import React, { useContext } from "react";
import { Link , useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/");
  }

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/exchange">Exchange</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/account">My Account</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
