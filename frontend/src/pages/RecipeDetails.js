import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from '../config';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching recipe");
        }

        const data = await response.json();
        setRecipe(data);
        console.log("Fetched recipe:", data); 

        // Check if recipe is saved
        const savedResponse = await fetch(`${API_URL}/api/recipes/saved`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!savedResponse.ok) {
          throw new Error("Error fetching saved recipes");
        }

        const savedRecipes = await savedResponse.json();
        const saved = savedRecipes.some((r) => r._id === data._id);
        setIsSaved(saved);

      } catch (error) {
        setError(error.message);
      }
    };

    getRecipe();
  }, [id]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // Function to delete the recipe
  const DeleteRecipe = async () => {
    try {
      await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/");
      console.log("Recipe deleted successfully");
      alert("Recipe deleted successfully");
    } catch (error) {
      setError("Failed to delete recipe");
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };


  // Function to save the recipe to the user's library
  const SaveRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/save/${recipe._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      setIsSaved(true); // update UI
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the recipe.");
    }
  };

  // Function to unsave the recipe from the user's library
  const UnsaveRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/unsave/${recipe._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to unsave recipe");
      }

      setIsSaved(false); // update UI
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to unsave the recipe.");
    }
  };

  // Function to handle rating
  const handleRating = async (ratingValue) => {
  try {
    const response = await fetch(`${API_URL}/api/recipes/${id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ value: ratingValue }),
    });

    if (!response.ok) throw new Error("Failed to rate recipe");
    const data = await response.json();

    setRecipe((prev) => ({
      ...prev,
      rating: {
        ...prev.rating,
        average: data.average,
        count: data.count,
      },
    }));
  } catch (error) {
    console.error("Error submitting rating:", error);
    alert("Could not submit rating.");
  }
};

  return (
    <div className="recipe-details-page-container">
      <div className="recipe-details">
        <h1>{recipe.title}</h1>

        <div className="recipe-image-description">
          <img
            src={`${API_URL}/${recipe.image}`}
            alt="Not found..."
          />

          <ul>
            <li><strong>Time:</strong> {recipe.time}</li>
            <li><strong>Difficulty:</strong> {recipe.difficulty}</li>
            <li><strong>Type:</strong> {recipe.type}</li>
            <li><strong>Cuisine:</strong> {recipe.cuisine}</li>
            <li><strong>Tags:</strong> {recipe.tags}</li>
            <li><strong>Created by:</strong> {recipe.user_id?.username || 'Unknown'}</li>
            <li><strong>Created at:</strong> {new Date(recipe.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>
   
        <div className="recipe-ingredients-steps">
          <div className ="row">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.split('\n').map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="row">
            <h2>Steps</h2>
            <ol>
              {recipe.steps.split('\n').map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.user_id?._id !== localStorage.getItem("user_id") && (
          <div className="rating-section">
            <h3>Rate this recipe:</h3>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= recipe.userRating ? "selected" : ""}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rating-info">
          <p>
            Average Rating: {recipe.rating?.average?.toFixed(1) || "N/A"} (
            {recipe.rating?.count || 0} rating{recipe.rating?.count === 1 ? "" : "s"})
          </p>
        </div>
        
        <div className="button-group">
          {recipe.user_id?._id === localStorage.getItem("user_id") ? (
            <>
              <Link to={`/EditRecipe/${recipe._id}`} className="button-link">Edit recipe</Link>
              <button className="btn" onClick={DeleteRecipe}>Delete recipe</button>
            </>
          ) : (
            isSaved ? (
              <button className="btn" onClick={UnsaveRecipe} style={{ backgroundColor: 'red'}}>Unsave recipe</button>
            ) : (
              <button className="btn" onClick={SaveRecipe}>Save recipe</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;