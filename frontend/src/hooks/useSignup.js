import { useNavigate } from "react-router-dom";

const useSignup = (setIsAuthenticated) => {
  const navigate = useNavigate();

  const handleSignup = async (username, email, hashedPassword) => {
    try {
      const response = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, hashedPassword }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.token);
        console.log("User signed up successfully!");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        console.error("Sign up failed");
        alert("Sign up failed");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return {
    handleSignup,
  };
};

export default useSignup;