import { Link } from "react-router-dom";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import img from "../images/LogoIcon.png";


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
    <div className="page-container-login-register">
      <form className="login-register-section" onSubmit={handler}>
        <div className="logo-title-container">
          <img src={img} className="logo" alt="logo" />
          <h3>Sign Up</h3>
        </div>
        <input {...username} placeholder="Username" required/>
        <input {...email} placeholder="Email" required/>
        <input {...password} placeholder="Password"required />
        <input {...password2} placeholder="Write password again..." required/>
        <Link to="/SignIn" className="link">Already registered? Sign in</Link>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
