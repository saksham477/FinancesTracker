import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import logoImg from "../Images/logo.png";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { user } = useUser();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">Finance</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/account">My Account</Link>
        </li>
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
      </ul>
      <span className="Login-Register">
        {user?.name ? (
          <>
            <span style={{ color: "white", marginRight: "10px" }}>
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login-register"
            style={{ textDecoration: "none", color: "white" }}
          >
            Login/Register
          </Link>
        )}
      </span>
    </nav>
  );
};

export default NavBar;
