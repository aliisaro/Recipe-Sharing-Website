import { useEffect, useState } from "react";
import { API_URL } from "../config";
import RecipeCard from "../components/RecipeCard";
import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import Pagination from "../components/Pagination";
import { Type, Cuisine, Tags, SortByOptions } from "../data/recipeOptions";
import { showError } from "../utils/ShowMessages";

const Library = () => {
  const PAGE_SIZE = 12;
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdPage, setCreatedPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const [createdTotalPages, setCreatedTotalPages] = useState(1);
  const [savedTotalPages, setSavedTotalPages] = useState(1);
  const [createdTotal, setCreatedTotal] = useState(0);
  const [savedTotal, setSavedTotal] = useState(0);
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
    setCreatedPage(1);
    setSavedPage(1);
  }, [filters, searchTerm]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const baseQuery = new URLSearchParams();

        if (filters.type && filters.type !== "none")
          baseQuery.append("type", filters.type);
        if (filters.cuisine && filters.cuisine !== "none")
          baseQuery.append("cuisine", filters.cuisine);
        if (filters.tags && filters.tags.length > 0)
          baseQuery.append("tags", filters.tags.join(","));
        if (searchTerm) baseQuery.append("search", searchTerm);

        const createdQuery = new URLSearchParams(baseQuery);
        createdQuery.append("page", String(createdPage));
        createdQuery.append("limit", String(PAGE_SIZE));

        const savedQuery = new URLSearchParams(baseQuery);
        savedQuery.append("page", String(savedPage));
        savedQuery.append("limit", String(PAGE_SIZE));

        const [savedRes, createdRes] = await Promise.all([
          fetch(`${API_URL}/api/recipes/saved?${savedQuery.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/recipes/user?${createdQuery.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

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

        if (Array.isArray(created)) {
          setCreatedRecipes(created);
          setCreatedTotal(created.length);
          setCreatedTotalPages(1);
        } else {
          setCreatedRecipes(created.recipes || []);
          setCreatedTotal(created.pagination?.total || 0);
          setCreatedTotalPages(created.pagination?.totalPages || 1);
        }

        if (Array.isArray(saved)) {
          setSavedRecipes(saved);
          setSavedTotal(saved.length);
          setSavedTotalPages(1);
        } else {
          setSavedRecipes(saved.recipes || []);
          setSavedTotal(saved.pagination?.total || 0);
          setSavedTotalPages(saved.pagination?.totalPages || 1);
        }
      } catch (error) {
        showError(setError, "Error fetching library");
        setCreatedRecipes([]);
        setSavedRecipes([]);
        setCreatedTotal(0);
        setSavedTotal(0);
        setCreatedTotalPages(1);
        setSavedTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [filters, searchTerm, createdPage, savedPage]);

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
          <>
            <div className="loader"></div>
          </>
        ) : error ? (
          <p>No recipes found...</p>
        ) : (
          <>
            {activeTab === "created" && (
              <div className="CreatedRecipes">
                {createdRecipes.length === 0 ? (
                  <p>No created recipes yet</p>
                ) : (
                  <>
                    <div className="recipes">
                      {createdRecipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                      ))}
                    </div>

                    <Pagination
                      page={createdPage}
                      totalPages={createdTotalPages}
                      totalItems={createdTotal}
                      onPrevious={() =>
                        setCreatedPage((prev) => Math.max(prev - 1, 1))
                      }
                      onNext={() =>
                        setCreatedPage((prev) =>
                          Math.min(prev + 1, createdTotalPages),
                        )
                      }
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="SavedRecipes">
                {savedRecipes.length === 0 ? (
                  <p>No recipes saved..</p>
                ) : (
                  <>
                    <div className="recipes">
                      {savedRecipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                      ))}
                    </div>

                    <Pagination
                      page={savedPage}
                      totalPages={savedTotalPages}
                      totalItems={savedTotal}
                      onPrevious={() =>
                        setSavedPage((prev) => Math.max(prev - 1, 1))
                      }
                      onNext={() =>
                        setSavedPage((prev) =>
                          Math.min(prev + 1, savedTotalPages),
                        )
                      }
                    />
                  </>
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
