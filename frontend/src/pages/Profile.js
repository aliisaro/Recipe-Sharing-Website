import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';

const ProfilePage = () => {
  //const { username } = useParams();
  const [profile, setProfile] = useState(null);

  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}api/users/profile/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1>{profile.username}</h1>
      <img src={`${API_URL}/${profile.image}`} alt={profile.username} />
      <p>Bio: {profile.bio}</p>
      <p>Followers: {profile.followers}</p>
      <p>Following: {profile.following}</p>
    </div>
  );
};

export default ProfilePage;