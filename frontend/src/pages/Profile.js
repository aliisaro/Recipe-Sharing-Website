import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { showError, showSuccess } from "../utils/ShowMessages";
import usePasswordStrength from "../hooks/usePasswordStrength";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { strength, requirements } = usePasswordStrength(formData.password);

  const userId = localStorage.getItem("user_id");

  // Fetch profile by user ID
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        showError(setError,'Error fetching profile data');
      }
    };

    fetchProfile();
  }, [userId]);

  // Update user profile
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Remove fields that are empty strings
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== "")
    );

    // If nothing to update, skip the request
    if (Object.keys(cleanedFormData).length === 0) {
      showError(setError, "No changes to update");
      return;
    }

    if (formData.password && requirements.some(r => !r.passed)) {
      showError(setError, "Password does not meet the required criteria");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showError(setError, "Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(cleanedFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      showSuccess(setSuccess, "Profile updated successfully!");

      // Clear form data after successful update
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      showError(setError, error.message || 'Error updating profile');
    }
  };

  // Delete user account
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear local storage and redirect
      localStorage.clear();
      window.location.href = "/SignIn";
    } catch (error) {
      showError(setError, error.message);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-content">            
        <h1>Profile</h1>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>

        <form onSubmit={handleSubmit} className="profile-form">
          <label>Change Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <label>Change Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label>Change Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {formData.password && (
            <div className="password-strength-container">
              <p className={`password-strength ${strength}`}>
                Password strength: {strength}
              </p>
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

          <label>Write password again</label>
          <input 
            type="password"
            id="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit">Save changes</button>

          {!showConfirm ? (
            <button
              type="button"
              className="delete-account-button"
              onClick={() => setShowConfirm(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="confirm-delete-buttons">
              <p>Are you sure you want to delete your account? This action will delete all your recipes and cannot be undone.</p>
              <button
                type="button"
                className="confirm-delete"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
              <button
                type="button"
                className="cancel-delete"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
