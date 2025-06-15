import { Link } from "react-router-dom";
import useField from "../hooks/useField";
import useSignin from "../hooks/useSignin";

const SignIn = ({ setIsAuthenticated }) => {
  const username = useField("username");
  const password = useField("password");

  const { handleSignin } = useSignin(setIsAuthenticated);

  const handler = (event) => {
    event.preventDefault();
    handleSignin(username.value, password.value);
  };

  return (
    <>
      <form className="login-register-section" onSubmit={handler}>
        <h3>Sign in</h3>
        <input {...username} placeholder="Username"/>
        <input {...password} placeholder="Password"/>
        <Link to="/SignUp" className="login-register-link">Not registered? Sign up </Link>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
};

export default SignIn;
