import React, { useEffect, useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("");
  const apiUrl = "http://localhost:5000/"; // Replace with your actual API URL

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.log(err));
  }, [apiUrl]);

  return (
    <div className="home">
      <h1>Homepage</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;
