import { Link } from "react-router-dom";
import useField from "../hooks/useField";
import useSignin from "../hooks/useSignin";
import img from "../images/LogoIcon.png";

const SignIn = ({ setIsAuthenticated }) => {
  const username = useField("username");
  const password = useField("password");

  const { handleSignin } = useSignin(setIsAuthenticated);

  const handler = (event) => {
    event.preventDefault();
    handleSignin(username.value, password.value);
  };

  return (
    <div className="page-container-login-register">
      <form className="login-register-section" onSubmit={handler}>
        <div className="logo-title-container">
          <img src={img} className="logo" alt="logo" />
          <h3>Sign in</h3>
        </div>
        <input {...username} placeholder="Username" required/>
        <input {...password} placeholder="Password" required/>
        <Link to="/SignUp" className="link">Not registered? Sign up </Link>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default SignIn;
