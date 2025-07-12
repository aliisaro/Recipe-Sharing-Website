import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  //INITIAL FORM DATA
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    time: "",
    difficulty: "",
    image: null,
    type: "",
    cuisine: "",
    tags: [],
  });

  //HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //HANDLE IMAGE CHANGE
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  //CREATE RECIPE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = new FormData();
    for (const key in formData) {
      recipeData.append(key, formData[key]);
    }

    console.log("Recipe Data: ", recipeData);

    const response = await fetch("http://localhost:4000/api/recipes", {
      method: "POST",
      body: recipeData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      navigate("/");
    }
  };

  //SELECT OPTIONS
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
    { value: "none", label: "none" },
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
    <div className="page-container-recipe-form">
      <form
        className="recipe-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1>Create a New Recipe</h1>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Time</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label>Ingredients</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          placeholder="Write the ingredients here:"
        />

        <label>Steps</label>
        <textarea
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          required
          placeholder="Write the steps here:"
        />

        <div className="section"> 
          <div className="row">
            <label>Difficulty</label>
            <Select
              options={Difficulty}
              placeholder="Choose difficulty:"
              onChange={(selectedOption) =>
                setFormData({ ...formData, difficulty: selectedOption.value })
              }
              value={{ label: formData.difficulty, value: formData.difficulty }}
              required
            />

            <label>Type</label>
            <Select
              options={Type}
              placeholder="Choose type:"
              onChange={(selectedOption) =>
                setFormData({ ...formData, type: selectedOption.value })
              }
              value={{ label: formData.type, value: formData.type }}
              required
            />
          </div>

          <div className="row">
            <label>Cuisine</label>
            <Select
              options={Cuisine}
              placeholder="Choose cuisine:"
              onChange={(selectedOption) =>
                setFormData({ ...formData, cuisine: selectedOption.value })
              }
              value={{ label: formData.cuisine, value: formData.cuisine }}
              required
            />

            <label>Tags</label>
            <Select
              isMulti
              options={Tags}
              placeholder="Select tags:"
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  tags: selectedOptions.map((option) => option.value),
                })
              }
              value={Tags.filter((tag) => formData.tags.includes(tag.value))}
              required
            />
          </div>
        </div>

        <label>Upload Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
        />

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};
export default CreateRecipe;
