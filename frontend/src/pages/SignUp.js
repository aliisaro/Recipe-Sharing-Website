import { Link } from "react-router-dom";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import img from "../images/LogoIcon.png";
import usePasswordStrength from "../hooks/usePasswordStrength";
import React, { useState } from "react";

const SignUp = ({ setIsAuthenticated }) => {
  const username = useField("username");
  const email = useField("email");
  const password = useField("password");
  const password2 = useField("password");

  const { strength, requirements } = usePasswordStrength(password.value);

  // Get error and handleSignup from the hook
  const { handleSignup, error } = useSignup(setIsAuthenticated);

  // State for password mismatch error
  const [localError, setLocalError] = useState("");

  const handler = (event) => {
    event.preventDefault();
    // Check if passwords match
    if (password.value !== password2.value) {
      setLocalError("Passwords do not match.");
      password2.onChange({ target: { value: "" } }); // Clear the second password field
      return;
    }
    setLocalError(""); // Clear local error if passwords match
    handleSignup(username.value, email.value, password.value);
  };

  return (
    <div className="page-container-login-register">
      <form className="login-register-form" onSubmit={handler}>
        <div className="logo-title-container">
          <img src={img} className="logo" alt="logo" />
          <h3>Sign Up</h3>
        </div>
        <input {...username} placeholder="Username"/>
        <input {...email} placeholder="Email"/>
        <input {...password} placeholder="Password"/>

        {password.value && (
          <div className="password-strength-container">
            <p className={`password-strength ${strength}`}>Password strength: {strength}</p>
            {requirements.length > 0 && (
              <ul className="password-requirements">
                {requirements.map(({ message, passed }) => (
                  <li key={message} className={passed ? "passed" : "failed"}>
                    {passed ? "✔️" : "❌"} {message}
                  </li>
                ))}
              </ul>
            )}

          </div>
        )}

        <input {...password2} placeholder="Write password again..."/>
        <Link to="/SignIn" className="link">Already registered? Sign in</Link>

        {error && <div className="error-message">{error}</div>}
        {localError && <div className="error-message">{localError}</div>}

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignUp;
