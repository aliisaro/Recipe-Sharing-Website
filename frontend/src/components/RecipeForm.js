import { useState } from "react";
import Select from "react-select";

const RecipeForm = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  //Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipe = {
      title,
      ingredients,
      steps,
      time,
      difficulty,
      image,
      type,
      cuisine,
      tags,
    };

    const response = await fetch("http://localhost:4000/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.log("Error: " + json.error);
      alert("Failed to add recipe to database. Please try again.");
    }
    if (response.ok) {
      console.log("Recipe added to database successfully");
      alert("Recipe added to database successfully");
    }
  };

  //OPTIONS
  const Difficulty = [
    { value: "easy", label: "easy" },
    { value: "medium", label: "medium" },
    { value: "hard", label: "hard" },
  ];

  const Type = [
    { value: "none", label: "none" },
    { value: "drinks", label: "drinks" },
    { value: "breakfeast", label: "breakfeast" },
    { value: "lunch", label: "lunch" },
    { value: "dinner", label: "dinner" },
    { value: "dessert", label: "dessert" },
    { value: "snacks", label: "snacks" },
  ];

  const Cuisine = [
    { value: "none", label: "none" },
    { value: "asian", label: "asian" },
    { value: "african", label: "african" },
    { value: "european", label: "european" },
    { value: "oceanian", label: "oceanian" },
    { value: "north american", label: "north american" },
    { value: "south american", label: "south american" },
  ];

  const Tags = [
    { value: "vegan", label: "vegan" },
    { value: "vegetarian", label: "vegetarian" },
    { value: "pescatarian", label: "pescatarian" },
    { value: "gluten free", label: "gluten free" },
    { value: "dairy free", label: "dairy free" },
    { value: "low carb", label: "low carb" },
    { value: "low fat", label: "low fat" },
    { value: "low sugar", label: "low sugar" },
  ];

  return (
    <form
      className="recipe-form"
      onSubmit={handleSubmit}
      enctype="multipart/form-data"
    >
      <h3>Add a New Recipe</h3>
      <div className="top-row">
        <div className="form-column">
          <label>Title:</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>

        <div className="form-column">
          <label>Time:</label>
          <input
            type="texta"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            required
          />
        </div>
      </div>
      <div className="bottom-row">
        <div className="form-column">
          <label>Ingredients:</label>
          <br />
          <textarea
            type="text"
            onChange={(e) => setIngredients(e.target.value)}
            value={ingredients}
            required
            placeholder="Write the ingredients here:
            -Ingredient 1
            -Ingredient 2
            -Ingredient 3"
          />
          <br />
          <label>Steps:</label>
          <br />
          <textarea
            type="text"
            onChange={(e) => setSteps(e.target.value)}
            value={steps}
            required
            placeholder="Write the steps here:
            -Step 1
            -Step 2
            -Step 3"
          />
        </div>

        <div className="form-column">
          <label>Difficulty:</label>
          <Select
            options={Difficulty}
            onChange={(selectedOption) => setDifficulty(selectedOption.value)}
            value={{ label: difficulty, value: difficulty }}
            required
          />

          <label>Type:</label>
          <Select
            options={Type}
            onChange={(selectedOption) => setType(selectedOption.value)}
            value={{ label: type, value: type }}
            required
          />

          <label>Cuisine:</label>
          <Select
            options={Cuisine}
            onChange={(selectedOption) => setCuisine(selectedOption.value)}
            value={{ label: cuisine, value: cuisine }}
            required
          />

          <label>Tags: </label>
          <Select
            isMulti
            options={Tags}
            onChange={(selectedOptions) =>
              setTags(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            value={tags.map((tag) =>
              Tags.find((option) => option.value === tag)
            )}
          />
        </div>
      </div>
      <label>Upload Image:</label>
      <input type="file" id="image" name="image" value="" required />{" "}
      
      <button>Add Recipe</button>
    </form>
  );
};
export default RecipeForm;
