import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../config';
import RecipeCard from "../components/RecipeCard";
import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import {Type, Cuisine, Tags, SortByOptions} from '../data/recipeOptions';

const Library = () => {
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("created");

  const [searchTerm, setSearchTerm] = useState("");
  
  const [filters, setFilters] = useState({
    type: null,
    cuisine: null,
    tags: [],
  });

  const handleFilterChange = (filterName, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]:
        filterName === "tags"
          ? selectedOption?.map((opt) => opt.value) || []
          : selectedOption
          ? selectedOption.value
          : null,
    }));
  };

  useEffect(() => {
  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();

      if (filters.type && filters.type !== "none") query.append("type", filters.type);
      if (filters.cuisine && filters.cuisine !== "none") query.append("cuisine", filters.cuisine);
      if (filters.tags && filters.tags.length > 0) query.append("tags", filters.tags.join(","));
      if (searchTerm) query.append("search", searchTerm);

      const token = localStorage.getItem("token");

      const queryString = query.toString();

      const savedRes = await fetch(`${API_URL}/api/recipes/saved?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdRes = await fetch(`${API_URL}/api/recipes/user?${queryString}`, {
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

    } catch (error) {
      setError("Error fetching library");
      setCreatedRecipes([]);
      setSavedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

    fetchLibrary();
  }, [filters, searchTerm]);

  return (
    <div className="library-page-container">
      <div className="library-content">
        <div className="library-nav">
          <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <Filters
            SortByOptions={SortByOptions}
            TypeOptions={Type}
            CuisineOptions={Cuisine}
            TagOptions={Tags}
            onFilterChange={handleFilterChange}
          />

          <ul>
            <li>
              <button
                className={activeTab === "created" ? "active" : ""}
                onClick={() => setActiveTab("created")}
              >
                Your Recipes
              </button>
            </li>
            <li>
              <button
                className={activeTab === "saved" ? "active" : ""}
                onClick={() => setActiveTab("saved")}
              >
                Saved Recipes
              </button>
            </li>
          </ul>
        </div>

        {loading ? (
        <><div className="loader"></div></>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            {activeTab === "created" && (
              <div className="CreatedRecipes">
                {createdRecipes.length === 0 ? (
                  <p>No created recipes yet</p>
                ) : (
                  <div className="recipes">
                    {createdRecipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="SavedRecipes">
                {savedRecipes.length === 0 ? (
                  <p>No saved recipes yet.</p>
                ) : (
                  <div className="recipes">
                    {savedRecipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Library;
