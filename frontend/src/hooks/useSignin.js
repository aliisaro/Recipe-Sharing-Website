import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const useSignin = (setIsAuthenticated) => {
  const navigate = useNavigate();

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
        console.log("User signed in successfully!");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        console.error("Sign in failed:", data.message || data.error);
        alert(data.error || "Sign in failed");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return {
    handleSignin,
  };
};

export default useSignin;
