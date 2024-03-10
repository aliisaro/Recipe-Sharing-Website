import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const RecipeForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [tags, setTags] = useState("");

  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Recipe = {
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
    const response = await fetch("/api/recipes", {
      method: "POST",
      body: JSON.stringify(Recipe),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
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
    { value: "drinks", label: "drinks"},
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
    { value: "middle eastern", label: "middle eastern" },
    { value: "mediterranean", label: "mediterranean" },
  ];

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>

      <label>Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required=""
      />

      <label>Ingredients:</label>
      <input
        type="text"
        onChange={(e) => setIngredients(e.target.value)}
        value={ingredients}
        required=""
      />

      <label>Steps:</label>
      <input
        type="text"
        onChange={(e) => setSteps(e.target.value)}
        value={steps}
        required=""
      />

      <label>Time:</label>
      <input
        type="text"
        onChange={(e) => setTime(e.target.value)}
        value={time}
        required=""
      />

      <label>Difficulty:</label>
      <Select
        options={Difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        value={difficulty}
        required=""
      ></Select>

      <label>Type:</label>
      <Select
        options={Type}
        onChange={(e) => setType(e.target.value)}
        value={type}
        required=""
      ></Select>

      <label>Cuisine:</label>
      <Select
        options={Cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        value={cuisine}
        required=""
      ></Select>

      <label>Tags:</label>
      <input
        type="text"
        onChange={(e) => setTags(e.target.value)}
        value={tags}
      />

      <button>Add Recipe</button>
    </form>
  );
};
export default RecipeForm;
