import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SignIn = ({ setLoggedIn, loggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Reset input fields when user logs out
  useEffect(() => {
    if (!loggedIn) {
      setUsername("");
      setPassword("");
    }
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const signInInfo = {
        username,
        password,
      };

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInInfo),
      });

      if (response.ok) {
        alert("Signed in successfully");
        console.log("Signed in successfully");
        setLoggedIn(true); // Update login status
      } else {
        console.log("Failed to sign in");
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to sign in");
      }
    } catch (error) {
      alert("Error signing in user:");
      console.log("Error signing in user:");
      console.error("Error signing in user:", error);
    }
  };

  return (
    <div className="login-register-section">
      {loggedIn ? (
        <>
          <h1>Welcome, {username}!</h1>
        </>
      ) : (
        <>
          <h1>Sign In</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button>Submit</button>
          </form>
          <Link to="/SignUp">Not registered? Sign Up</Link>
        </>
      )}
    </div>
  );
};

export default SignIn;
