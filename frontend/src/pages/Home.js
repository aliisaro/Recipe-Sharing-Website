import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import React, { useState, useEffect } from "react";
import { API_URL } from '../config';
import RecipeCard from "../components/RecipeCard";
import {Type, Cuisine, Tags, SortByOptions} from '../data/recipeOptions';

const Home = ({ searchTerm, setSearchTerm }) => {
  // State to hold the recipe array
  const [recipeArray, setRecipeArray] = useState([]);

  // State to handle filters
  const [filters, setFilters] = useState({
  type: null,
  cuisine: null,
  tags: null,
  });

  // State to handle errors
  const [error, setError] = useState(null);

  // Fetch recipes when the component mounts or filters change
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

  // Handle search term
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const query = new URLSearchParams();

        if (filters.type && filters.type !== "none") query.append("type", filters.type);
        if (filters.cuisine && filters.cuisine !== "none") query.append("cuisine", filters.cuisine);
        if (filters.tags && filters.tags.length > 0) query.append("tags", filters.tags.join(","));
        
        // Add search term query param
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
          return;
        }

        const data = await response.json();
        setRecipeArray(data);
      } catch (error) {
        console.error(error);
        setError("Error fetching recipes");
      }
    };

    getRecipes();
  }, [filters, searchTerm]);

  return (
    <div className="home-container">

      {/* Searchbar & filters */}
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
        <div className="recipes">
          {error && <h2>{error}</h2>}
          {recipeArray.length === 0 && !error && <h2>No recipes found...</h2>}
          {recipeArray.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
