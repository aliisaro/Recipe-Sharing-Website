import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./app.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateRecipe from "./pages/CreateRecipe";
import Library from "./pages/Library";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")) || false
  );

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/CreateRecipe"
          element={
            isAuthenticated ? <CreateRecipe /> : <Navigate to="/SignIn" />
          }
        />
        <Route
          path="/Library"
          element={isAuthenticated ? <Library /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/Profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="SignIn"
          element={
            !isAuthenticated ? (
              <SignIn setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="SignUp"
          element={
            !isAuthenticated ? (
              <SignUp setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
