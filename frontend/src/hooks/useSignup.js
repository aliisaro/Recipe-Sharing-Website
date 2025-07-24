import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const useSignup = (setIsAuthenticated) => {
  const navigate = useNavigate();

  const handleSignup = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = data;;
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.token);
        console.log("User signed up successfully!");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        console.error("Sign up failed:", data.message || data.error);
        alert(data.error || "Sign up failed");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return {
    handleSignup,
  };
};

export default useSignup;
