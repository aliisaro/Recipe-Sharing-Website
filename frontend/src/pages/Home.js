import Select from "react-select";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [recipeArray, setRecipeArray] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/recipes/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error);
          console.error(data.error); // Log the error
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
    { value: "seafood free", label: "seafood free" },
  ];

  return (
    <div className="home">
      <h1>Explore recipes</h1>

      <div className="Recipes">
        {error && <h2>{error}</h2>}
        {recipeArray.length === 0 && !error && <h1>No Recipes</h1>}
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

      <div className="filters">
        <ul>
          <h3>Filters</h3>
          <li>
            Sort by: <Select options={SortByOptions} />
          </li>
          <li>
            Type: <Select options={TypeOptions} />
          </li>
          <li>
            Cuisine: <Select options={CuisineOptions} />
          </li>
          <li>
            Tags: <Select options={TagOptions} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
