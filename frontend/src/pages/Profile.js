import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { showError, showSuccess } from "../utils/ShowMessages";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const username = localStorage.getItem('username');

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

  try {
    const response = await fetch(`${API_URL}/api/users/update/${username}`, {
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
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      showError(setError, 'Error updating profile');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile/${username}`);
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
  }, [username]);  

  return (
    <div className="profile-page-container">
      <div className="profile-content">            
        <h1>Profile</h1>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>

        <form 
          onSubmit={handleSubmit}
          className="profile-form"
        >
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

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;