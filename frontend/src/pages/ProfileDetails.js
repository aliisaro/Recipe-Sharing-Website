import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from '../config';

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/profiles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      }
    };
    getProfile();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-details">
      <div className="row">
        <div className="column">
          <img
            src={`${API_URL}/${profile.image}`}
            alt="Not found..."
          />
        </div>

        <div className="column">
          <h1>{profile.title}</h1>
          <ul>
            <li>Time: {profile.time}</li>
            <li>Difficulty: {profile.difficulty}</li>
            <li>Type: {profile.type}</li>
            <li>Cuisine: {profile.cuisine}</li>
            <li>Tags: {profile.tags}</li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="column">
          <h2>Ingredients</h2>
          <p>{profile.ingredients}</p>
        </div>

        <div className="column">
          <h2>Steps</h2>
          <p>{profile.steps}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;