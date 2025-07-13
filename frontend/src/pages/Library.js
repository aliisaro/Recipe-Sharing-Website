import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../config';

const Library = () => {
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem("token");

      const savedRes = await fetch(`${API_URL}/api/recipes/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdRes = await fetch(`${API_URL}/api/recipes/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!savedRes.ok || !createdRes.ok) {
        const errData = await savedRes.json();
        setError(errData.error || "Error fetching recipes");
        return;
      }

      const saved = await savedRes.json();
      const created = await createdRes.json();

      setCreatedRecipes(created);
      setSavedRecipes(saved);

      console.log("Created recipes from backend:", created);
      console.log("Saved recipes from backend:", saved);
    } catch (error) {
      setError("Error fetching library");
      console.error(error);
    }
  };

    fetchLibrary();
  }, []);

  return (
    <div className="library">
      <h1>Library</h1>

      {error && <h2>{error}</h2>}

      <div className="CreatedRecipes">
        <h2>Your Recipes</h2>
        {createdRecipes.length === 0 ? (
          <p>No created recipes yet</p>
        ) : (
          <div className="recipes">
            {createdRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <Link to={`/${recipe._id}`}>
                  <div className="image-container">
                    <img
                      src={`${API_URL}/${recipe.image}`}
                      alt={recipe.title}
                    />
                    <p>{recipe.title} ({recipe.time})</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="SavedRecipes">
        <h2>Saved Recipes</h2>
        {savedRecipes.length === 0 ? (
          <p>No saved recipes</p>
        ) : (
          <div className="recipes">
            {savedRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <Link to={`/${recipe._id}`}>
                  <div className="image-container">
                    <img
                      src={`${API_URL}/${recipe.image}`}
                      alt={recipe.title}
                    />
                    <p>{recipe.title} ({recipe.time})</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
