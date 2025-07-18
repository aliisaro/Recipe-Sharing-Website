import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { API_URL } from '../config';

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  //FETCH RECIPE
  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to fetch recipe");
      }
    };

    getRecipe();
  }, [id]);

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

  //UPDATE RECIPE
  const handleSubmit = async (event) => {
    event.preventDefault();

    const recipeData = new FormData();

    for (const key in formData) {
      const value = formData[key];

      if (key === "image") {
        if (value instanceof File) {
          recipeData.append(key, value, value.name);
        }
      } else if (Array.isArray(value)) {
        recipeData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        recipeData.append(key, value);
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "PUT",
        body: recipeData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      alert("Recipe updated successfully");
      navigate(`/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError("Failed to update recipe");
      alert("Failed to update recipe.");
    }
  };

  //OPTIONS FOR SELECTS
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
    <div className="edit-recipe-page-container">
      <form
        className="recipe-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Time:</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />

        <label>Ingredients:</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Write the ingredients here:"
        />

        <label>Steps:</label>
        <textarea
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          placeholder="Write the steps here:"
        />

        <label>Difficulty:</label>
        <Select
          options={Difficulty}
          onChange={(selectedOption) =>
            setFormData({ ...formData, difficulty: selectedOption.value })
          }
          value={{ label: formData.difficulty, value: formData.difficulty }}
        />

        <label>Type:</label>
        <Select
          options={Type}
          onChange={(selectedOption) =>
            setFormData({ ...formData, type: selectedOption.value })
          }
          value={{ label: formData.type, value: formData.type }}
        />

        <label>Cuisine:</label>
        <Select
          options={Cuisine}
          onChange={(selectedOption) =>
            setFormData({ ...formData, cuisine: selectedOption.value })
          }
          value={{ label: formData.cuisine, value: formData.cuisine }}
        />

        <label>Tags: </label>
        <Select
          isMulti
          options={Tags}
          onChange={(selectedOptions) =>
            setFormData({
              ...formData,
              tags: selectedOptions.map((option) => option.value),
            })
          }
          value={Tags.filter((tag) => formData.tags.includes(tag.value))}
        />

        <label>Upload Image:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" />

        <div className="edit-cancel-buttons">
          <button type="submit">Done</button>
          <button type="button" onClick={() => navigate(`/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
