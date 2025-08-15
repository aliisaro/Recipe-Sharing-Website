import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useState } from "react";

const useSignin = (setIsAuthenticated) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSignin = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = data;
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError(
          data.message || data.error || "Sign in failed. Please try again.",
        );
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return {
    handleSignin,
    error,
  };
};

export default useSignin;
