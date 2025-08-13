import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from '../config';
import { showError, showSuccess } from "../utils/ShowMessages";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        showError(setError, error.message);
      }
    };

    getRecipe();
  }, [id]);

  
  if (!recipe) return <div>Loading...</div>;

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

      showSuccess(setSuccess, "Recipe deleted successfully!");
    } catch (error) {
      showError(setError, "An error occurred while deleting the recipe.");
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

      setIsSaved(true);
      showSuccess(setSuccess, "Recipe saved successfully!");
    } catch (error) {
      showError(setError, "An error occurred while saving the recipe.");
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

      setIsSaved(false);

      showSuccess(setSuccess, "Recipe unsaved successfully!");
    } catch (error) {
      showError(setError, "An error occurred while trying to unsave the recipe.");
    }
  };

  // Function to handle rating
  const handleRating = async (ratingValue) => {
  try {
    const response = await fetch(`${API_URL}/api/recipes/rate/${id}`, {
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
        userRating: data.userRating,
      },
    }));

    showSuccess(setSuccess, "Rating submitted!");
  } catch (error) {
    showError(setError, "Could not submit rating.");
  }
};

  return (
    <div className="recipe-details-page-container">
      <div className="recipe-details">
        <h1>{recipe.title}</h1>

        <div className="recipe-image-description">
          <img
            src={`${recipe.image}`}
            alt="Image not found..."
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
          <div className="row">
            <h2>Ingredients</h2>
            <ul>
              {(ingredientsExpanded
                ? recipe.ingredients.split('\n')
                : recipe.ingredients.split('\n').slice(0, 3)
              ).map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
            {recipe.ingredients.split('\n').length > 3 && (
              <button onClick={() => setIngredientsExpanded(!ingredientsExpanded)}>
                {ingredientsExpanded ? "Show less" : "Show all ingredients"}
              </button>
            )}
          </div>

          <div className="row">
            <h2>Steps</h2>
            <ol>
              {(stepsExpanded
                ? recipe.steps.split('\n')
                : recipe.steps.split('\n').slice(0, 3)
              ).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            {recipe.steps.split('\n').length > 3 && (
              <button onClick={() => setStepsExpanded(!stepsExpanded)}>
                {stepsExpanded ? "Show less" : "Show all steps"}
              </button>
            )}
          </div>
        </div>


        {recipe.user_id?._id !== localStorage.getItem("user_id") && (
          <div className="rating-section">
            <h3>Rate this recipe:</h3>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${hoveredStar >= star || (!hoveredStar && recipe.userRating >= star) ? "selected" : ""}`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
        
        <p>
          Average Rating: {recipe.rating?.average?.toFixed(1) || "N/A"} (
          {recipe.rating?.count || 0} rating{recipe.rating?.count === 1 ? "" : "s"})
        </p>

        {recipe.user_id?._id !== localStorage.getItem("user_id") && (
          <div className="rating-info">
            {recipe.rating?.userRating ? (
              <p>You rated this recipe: {recipe.rating.userRating}/5★</p>
            ) : (
              <p>You haven't rated this recipe yet.</p>
            )}
          </div>
        )}

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button className="return-button" onClick={() => navigate(-1)}>Return</button>
          {recipe.user_id?._id === localStorage.getItem("user_id") ? (
            <>
              <Link to={`/EditRecipe/${recipe._id}`} className="edit-button">Edit recipe</Link>
              <button className="deleteButton" onClick={DeleteRecipe}>Delete recipe</button>
            </>
          ) : (
            isSaved ? (
              <button className="unsaveButton" onClick={UnsaveRecipe}>Unsave recipe</button>
            ) : (
              <button className="saveButton" onClick={SaveRecipe}>Save recipe</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;