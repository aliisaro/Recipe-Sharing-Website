import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching recipe");
        }
        const data = await response.json();
        setRecipe(data);
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

  return (
    <div className="recipe-details">
      <div className="row">
        <div className="column">
          <img
            src={`http://localhost:4000/${recipe.image}`}
            alt="Not found..."
          />
        </div>

        <div className="column">
          <h1>{recipe.title}</h1>
          <ul>
          <li>Time: {recipe.time}</li>
          <li>Difficulty: {recipe.difficulty}</li>
          <li>Type: {recipe.type}</li>
          <li>Cuisine: {recipe.cuisine}</li>
          <li>Tags: {recipe.tags}</li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="column">
          <h2>Ingredients</h2>
          <p>{recipe.ingredients}</p>
        </div>

        <div className="column">
          <h2>Steps</h2>
          <p>{recipe.steps}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
