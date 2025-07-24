import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../config';
import RecipeCard from "../components/RecipeCard";

const Library = () => {
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

    fetchLibrary();
  }, []);

  return (
    <div className="library">

      {loading ? (
        <h2>Loading recipes...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          {/* Your Recipes & Saved Recipes */}
          <div className="CreatedRecipes">
            <h2>Your Recipes</h2>
            {createdRecipes.length === 0 ? (
              <p>No created recipes yet</p>
            ) : (
              <div className="recipes">
                {createdRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}

            <div className="SavedRecipes">
              <h2>Saved Recipes</h2>
              {savedRecipes.length === 0 ? (
                <p>No saved recipes yet. <Link to="/home">Browse recipes</Link> and save your favorites!</p>
              ) : (
                <div className="recipes">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Library;
