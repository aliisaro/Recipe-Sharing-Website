import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create an object containing the user's information
      const signUpInfo = {
        username,
        email,
        password,
      };

      // Send a POST request to the backend server with the user's information
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });

      if (response.ok) {
        alert("User registered successfully");
        console.log("User registered successfully");
        // Clear the form fields upon successful registration
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        alert("Failed to register user");
        console.error("Failed to register user");
        // Handle error response from the server
      }
    } catch (error) {
      alert("Error registering user");
      console.error("Error registering user:", error);
      // Handle other errors, such as network errors
    }
  };

  return (
    <div className="login-register-section">
      <h1>Sign Up</h1>
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
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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
      <Link to="/SignIn">Already registered? Sign in</Link>
    </div>
  );
};

export default SignUp;
