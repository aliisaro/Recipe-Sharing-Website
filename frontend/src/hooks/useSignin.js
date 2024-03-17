import { useNavigate } from "react-router-dom";

const useSignin = (setIsAuthenticated) => {
  const navigate = useNavigate();

  const handleSignin = async (username, hashedPassword) => {
    try {
      const response = await fetch("http://localhost:4000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, hashedPassword }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log(user);
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.token);
        console.log("User signed in successfully!");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        console.error("Sign in failed");
        alert("Sign in failed");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return {
    handleSignin,
  };
};

export default useSignin;
