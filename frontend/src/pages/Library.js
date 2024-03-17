import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Library = () => {
  const [recipeArray, setRecipeArray] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/recipes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error);
          setRecipeArray([]);
          return;
        }
        const data = await response.json();
        setRecipeArray(data);
      } catch (error) {
        setError("Error fetching recipes");
        console.error(error);
      }
    };
    getRecipe();
  }, []);

  return (
    <div className="library">
      <h1>Library</h1>

      <div className="recipes">
        {error && <h2>{error}</h2>}
        {recipeArray.length === 0 && !error && <h2>No Recipes</h2>}
        {recipeArray.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <Link to={`/${recipe._id}`}>
            <div className="image-container">
              <img
                src={`http://localhost:4000/${recipe.image}`}
                alt={recipe.title}
              />
              <p>{recipe.title} ({recipe.time})</p>
            </div>
            </Link>
          </div>
        ))}
      </div>

      </div>
  );
};

export default Library;
