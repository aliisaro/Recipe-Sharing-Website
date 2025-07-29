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
  const [activeTab, setActiveTab] = useState("created");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: null,
    cuisine: null,
    tags: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();

      if (filters.type && filters.type !== "none") query.append("type", filters.type);
      if (filters.cuisine && filters.cuisine !== "none") query.append("cuisine", filters.cuisine);
      if (filters.tags && filters.tags.length > 0) query.append("tags", filters.tags.join(","));
      if (searchTerm) query.append("search", searchTerm);

      const savedRes = await fetch(`${API_URL}/api/recipes/saved?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdRes = await fetch(`${API_URL}/api/recipes/user?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!savedRes.ok || !createdRes.ok) {
        const data = await savedRes.json();
        setError(data.error || "Error fetching recipes");
        setCreatedRecipes([]);
        setSavedRecipes([]);
        setLoading(false);
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
          <p>No recipes found...</p>
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
                  <p>No recipes found..</p>
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
