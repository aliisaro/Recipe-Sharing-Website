import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import React, { useState, useEffect } from "react";
import { API_URL } from '../config';
import RecipeCard from "../components/RecipeCard";
import {Type, Cuisine, Tags, SortByOptions} from '../data/recipeOptions';

const Home = ({ searchTerm, setSearchTerm }) => {
  const [recipeArray, setRecipeArray] = useState([]);
  const [filters, setFilters] = useState({
    type: null,
    cuisine: null,
    tags: null,
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

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();

        if (filters.type && filters.type !== "none") query.append("type", filters.type);
        if (filters.cuisine && filters.cuisine !== "none") query.append("cuisine", filters.cuisine);
        if (filters.tags && filters.tags.length > 0) query.append("tags", filters.tags.join(","));
        if (searchTerm) query.append("search", searchTerm);

        const response = await fetch(`${API_URL}/api/recipes/all?${query.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error);
          setRecipeArray([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setRecipeArray(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching recipes");
        setRecipeArray([]);
        setLoading(false);
      }
    };

    getRecipes();
  }, [filters, searchTerm]);

  return (
    <div className="home-container">
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
            <h2>Loading recipes...</h2>
            <div className="loader"></div>
          </>
        ) : error ? (
          <h2>No recipes found...</h2>
        ) : (
          <div className="recipes">
            {recipeArray.length === 0 && <h2>No recipes found...</h2>}
            {recipeArray.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
