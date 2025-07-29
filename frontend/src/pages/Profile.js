import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const username = localStorage.getItem('username');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users/profile/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error(error);
      setError('Error updating profile');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/users/profile/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);  

  return (
    <div className="profile-page-container">
      <div className="profile-content">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            
            <h1>Profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>

            <form 
              onSubmit={handleSubmit}
              className="profile-form"
            >
              <div>
                <label htmlFor="username">Change Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email">Change Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password">Change Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit">Save changes</button>
            </form>

          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;