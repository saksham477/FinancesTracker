import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useUser } from "../context/UserContext";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("Sign Up");
  const [error, setError] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError({});
    setResponseMessage("");
  }, [action]);

  const validateForm = () => {
    const newError = {};
    if (!name && action === "Sign Up") {
      newError.name = "Please enter a name";
    }
    if (!email) {
      newError.email = "Please enter an email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newError.email = "Email is invalid";
    }
    if (!password) {
      newError.password = "Please enter password";
    } else if (password.length < 8 && action === "Sign Up") {
      newError.password = "Password must be at least 8 characters";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (action === "Login") {
        const response = await axios.post("http://localhost:3000/login", {
          email,
          password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          setUser(response.data.user);
          navigate("/");
        }
      } else {
        const response = await axios.post("http://localhost:3000/register", {
          name,
          email,
          password,
          role: "user",
        });

        if (response.data.token) {
          setResponseMessage("Registration successful! Please login");
          setAction("Login");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setResponseMessage(
        err.response?.data?.message ||
          (action === "Login" ? "Login failed" : "Registration failed")
      );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
      </div>

      <div className="inputs">
        <form onSubmit={handleSubmit}>
          {action === "Login" ? (
            <div>
              <div className="input">
                <MdEmail />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error.email && <p className="error">{error.email}</p>}
              <div className="input">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <span onClick={togglePassword}>
                  <FaEye />
                </span>
              </div>
              {error.password && <p className="error">{error.password}</p>}
            </div>
          ) : (
            <div>
              <div className="input">
                <FaUser />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                />
              </div>
              {error.name && <p className="error">{error.name}</p>}
              <div className="input">
                <MdEmail />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
              </div>
              {error.email && <p className="error">{error.email}</p>}
              <div className="input">
                <FaLock />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <span onClick={togglePassword}>
                  <FaEye />
                </span>
              </div>
              {error.password && <p className="error">{error.password}</p>}
            </div>
          )}

          <div className="forgot-password">
            Forgot Password? <span>Click Here!</span>
          </div>
          <button type="submit" className="submit-button">
            {action}
          </button>
          {responseMessage && (
            <div
              className={`response-message ${
                responseMessage.includes("successful") ? "success" : "error"
              }`}
            >
              {responseMessage}
            </div>
          )}
        </form>
      </div>
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => setAction("Login")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;
