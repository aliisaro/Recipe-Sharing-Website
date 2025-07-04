import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./app.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import EditProfile from "./pages/EditProfile";
import Library from "./pages/Library";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")) || false
  );

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/CreateRecipe"
          element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/SignIn" />}
        />
        <Route path="/:id" element={<RecipeDetails />} />
        <Route path="/EditRecipe/:id" element={<EditRecipe />} />
        <Route
          path="/Library"
          element={isAuthenticated ? <Library /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/Profile/:name"
          element={isAuthenticated ? <Profile /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/EditProfile/:name"
          element={isAuthenticated ? <EditProfile /> : <Navigate to="/SignIn" />}
        />
        <Route
          path="/SignIn"
          element={!isAuthenticated ? <SignIn setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/SignUp"
          element={!isAuthenticated ? <SignUp setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
