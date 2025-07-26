import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { API_URL } from '../config';
import { Difficulty, Type, Cuisine, Tags} from '../data/recipeOptions';

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
  const file = e.target.files[0];
  if (file && file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB.");
    return;
  }
  setFormData({ ...formData, image: file });
  };

  //CREATE RECIPE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = new FormData();
    for (const key in formData) {
      recipeData.append(key, formData[key]);
    }

    console.log("Recipe Data: ", recipeData);

    const response = await fetch(`${API_URL}/api/recipes`, {
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

  return (
    <div className="recipe-form-page-container">
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
          placeholder="Enter recipe title"
          required
        />

        <label>Time</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="Enter cooking time"
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

        {formData.image && (
          <div className="mock-recipe-card">
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.image)} alt="Preview" />
              <p>{formData.title || "Recipe Title"} ({formData.time || "Time"})</p>
            </div>
          </div>
        )}


        {/* Show upload or change image input depending on whether image is set */}
        {formData.image == null ? (
          <>
            <label>Upload Image:</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </>
        ) : (
          <>
            <label>Change Image:</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </>
        )}

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};
export default CreateRecipe;
