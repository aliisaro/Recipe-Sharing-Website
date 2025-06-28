import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
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
        const savedResponse = await fetch(`http://localhost:4000/api/recipes/saved`, {
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
      await fetch(`http://localhost:4000/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/");
    } catch (error) {
      setError("Failed to delete recipe");
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };


  // Function to save the recipe to the user's library
  const SaveRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/recipes/save/${recipe._id}`, {
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
      const response = await fetch(`http://localhost:4000/api/recipes/unsave/${recipe._id}`, {
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

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>

      <div className="top-section">
        <div className="section">
          <img
            src={`http://localhost:4000/${recipe.image}`}
            alt="Not found..."
          />
        </div>

        <div className="section">
          <ul>
            <li><strong>Time:</strong> {recipe.time}</li>
            <li><strong>Difficulty:</strong> {recipe.difficulty}</li>
            <li><strong>Type:</strong> {recipe.type}</li>
            <li><strong>Cuisine:</strong> {recipe.cuisine}</li>
            <li><strong>Tags:</strong> {recipe.tags}</li>
          </ul>
        </div>
      </div>

      <div className="bottom-section">
        <div className="section">
          <h2>Ingredients</h2>
          <p>{recipe.ingredients}</p>
        </div>

        <div className="section">
          <h2>Steps</h2>
          <p>{recipe.steps}</p>
        </div>
      </div>

      <div className="button-group">
        {recipe.user_id === localStorage.getItem("user_id") ? (
          <>
            <Link to={`/EditRecipe/${recipe._id}`} className="button-link">Edit recipe</Link>
            <button className="btn" onClick={DeleteRecipe}>Delete recipe</button>
          </>
        ) : (
          isSaved ? (
            <button className="btn" onClick={UnsaveRecipe}>Unsave recipe</button>
          ) : (
            <button className="btn" onClick={SaveRecipe}>Save recipe</button>
          )
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;