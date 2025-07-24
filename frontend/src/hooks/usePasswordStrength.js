import { useState, useEffect } from "react";
import validator from "validator";

export default function usePasswordStrength(password) {
  const [strength, setStrength] = useState("");
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    if (!password) {
      setStrength("");
      setRequirements([]);
      return;
    }

    const requirementsData = [
      { message: "at least 8 characters", passed: password.length >= 8 },
      { message: "a number", passed: /\d/.test(password) },
      { message: "a lowercase letter", passed: /[a-z]/.test(password) },
      { message: "an uppercase letter", passed: /[A-Z]/.test(password) },
      { message: "a special character", passed: /[^A-Za-z0-9]/.test(password) },
    ];

    setRequirements(requirementsData);

    if (validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      setStrength("strong");
    } else if (password.length >= 6) {
      setStrength("medium");
    } else {
      setStrength("weak");
    }
  }, [password]);

  return { strength, requirements };
}
