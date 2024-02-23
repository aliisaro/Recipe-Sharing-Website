import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import NoPage from "./components/NoPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSignOut = () => {
    setLoggedIn(false);
    alert("User signed out");
    console.log("User signed out");
  };

  return (
    <BrowserRouter>
      <Navbar loggedIn={loggedIn} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="SignIn" element={<SignIn setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}/>
        <Route path="SignUp" element={<SignUp />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
