import Filters from "../components/Filters";
import Searchbar from "../components/Searchbar";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

        const response = await fetch(`http://localhost:4000/api/recipes/all?${query.toString()}`, {
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

  // Define filter options
  const SortByOptions = [
    { value: "trending", label: "trending" },
    { value: "date", label: "date" },
    { value: "best reviews", label: "best reviews" },
  ];

  const TypeOptions = [
    { value: "none", label: "none" },
    { value: "drinks", label: "drinks" },
    { value: "breakfeast", label: "breakfeast" },
    { value: "lunch", label: "lunch" },
    { value: "dinner", label: "dinner" },
    { value: "dessert", label: "dessert" },
    { value: "snacks", label: "snacks" },
  ];

  const CuisineOptions = [
    { value: "none", label: "none" },
    { value: "asian", label: "asian" },
    { value: "african", label: "african" },
    { value: "european", label: "european" },
    { value: "oceanian", label: "oceanian" },
    { value: "north american", label: "north american" },
    { value: "south american", label: "south american" },
  ];

  const TagOptions = [
    { value: "none", label: "none" },
    { value: "vegan", label: "vegan" },
    { value: "vegetarian", label: "vegetarian" },
    { value: "gluten free", label: "gluten free" },
    { value: "dairy free", label: "dairy free" },
    { value: "nut free", label: "nut free" },
    { value: "egg free", label: "egg free" },
    { value: "pescatarian", label: "pescatarian" },
    { value: "seafood free", label: "seafood free" },
  ];

  return (
    <div className="home">

      {/* Searchbar */}
      <div className="searchbar-title-container">
        <h1>Explore recipes</h1>
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Recipes */}
      <div className="Recipes">
        {error && <h2>{error}</h2>}
        {recipeArray.length === 0 && !error && <h2>No recipes found...</h2>}
        {recipeArray.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <Link to={`/${recipe._id}`}>
              <div className="image-container">
                <img
                  src={`http://localhost:4000/${recipe.image}`}
                  alt={recipe.title}
                />
                <p>
                  {recipe.title} ({recipe.time})
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Filters
        SortByOptions={SortByOptions}
        TypeOptions={TypeOptions}
        CuisineOptions={CuisineOptions}
        TagOptions={TagOptions}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Home;
