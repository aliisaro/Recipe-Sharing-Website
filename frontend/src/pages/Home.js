import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import { Type, Cuisine, Tags, SortByOptions } from "../data/recipeOptions";

const Home = () => {
  const PAGE_SIZE = 24;
  const [recipeArray, setRecipeArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [filters, setFilters] = useState({
    type: null,
    cuisine: null,
    tags: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setPage(1);
  }, [filters, searchTerm]);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams();

        if (filters.type && filters.type !== "none")
          query.append("type", filters.type);
        if (filters.cuisine && filters.cuisine !== "none")
          query.append("cuisine", filters.cuisine);
        if (filters.tags && filters.tags.length > 0)
          query.append("tags", filters.tags.join(","));
        if (searchTerm) query.append("search", searchTerm);
        query.append("page", String(page));
        query.append("limit", String(PAGE_SIZE));

        const recipes = await fetch(
          `${API_URL}/api/recipes/all?${query.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!recipes.ok) {
          const data = await recipes.json();
          setError(data.error || "Error fetching recipes");
          setRecipeArray([]);
          setTotalPages(1);
          setTotalRecipes(0);
          setLoading(false);
          return;
        }

        const data = await recipes.json();
        if (Array.isArray(data)) {
          setRecipeArray(data);
          setTotalRecipes(data.length);
          setTotalPages(1);
        } else {
          setRecipeArray(data.recipes || []);
          setTotalRecipes(data.pagination?.total || 0);
          setTotalPages(data.pagination?.totalPages || 1);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching recipes");
        setRecipeArray([]);
        setTotalPages(1);
        setTotalRecipes(0);
        setLoading(false);
      }
    };

    getRecipes();
  }, [filters, searchTerm, page]);

  return (
    <div className="home-page-container">
      <div className="searchbar-filters-container">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filters
          SortByOptions={SortByOptions}
          TypeOptions={Type}
          CuisineOptions={Cuisine}
          TagOptions={Tags}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="home-content">
        {loading ? (
          <>
            <div className="loader"></div>
          </>
        ) : error ? (
          <h2>No recipes found...</h2>
        ) : (
          <>
            <div className="recipes">
              {recipeArray.length === 0 && <h2>No recipes found...</h2>}
              {recipeArray.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalRecipes}
              onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
