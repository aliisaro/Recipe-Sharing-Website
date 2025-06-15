import { Link } from "react-router-dom";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";

const SignUp = ({ setIsAuthenticated }) => {
  const username = useField("username");
  const email = useField("email");
  const password = useField("password");
  const password2 = useField("password");

  const { handleSignup } = useSignup(setIsAuthenticated);

  const handler = (event) => {
    event.preventDefault();
    // Check if passwords match
    if (password.value !== password2.value) {
      alert("Passwords don't match. Please try again.");
      return;
    }
    // Call handleSignup only if passwords match
    handleSignup(username.value, email.value, password.value);
  };

  return (
    <>
      <form className="login-register-section" onSubmit={handler}>
        <h3>Sign Up</h3>
        <input {...username} placeholder="Username"/>
        <input {...email} placeholder="Email"/>
        <input {...password} placeholder="Password"/>
        <input {...password2} placeholder="Write password again..."/>
        <Link to="/SignIn" className="login-register-link">Already registered? Sign in</Link>
        <button type="submit">Sign up</button>

      </form>
    </>
  );
};

export default SignUp;
