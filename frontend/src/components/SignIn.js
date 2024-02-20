import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create an object containing the user's information
      const signInInfo = {
        username,
        password,
      };

      // Send a POST request to the backend server with the user's information
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInInfo),
      });

      if (response.ok) {
        alert("Signed in successfully");
        console.log("Signed in successfully");
        // Clear the form fields upon successful registration
        setUsername("");
        setPassword("");
      } else {
        alert("Failed to sign in");
        console.error("Failed to sign in");
        // Handle error response from the server
      }
    } catch (error) {
      alert("Error signing in user:");
      console.error("Error signing in user:", error);
      // Handle other errors, such as network errors
    }
  };

  return (
    <div className="login-register-section">
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
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
    </div>
  );
};

export default SignIn;
