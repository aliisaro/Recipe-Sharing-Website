import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { API_URL } from '../config';
import { Difficulty, Type, Cuisine, Tags } from '../data/recipeOptions';
import { showError } from "../utils/ShowMessages";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setFormData(prev => ({ ...prev, image: file }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.difficulty ||
      !formData.type ||
      !formData.cuisine ||
      formData.tags.length === 0
    ) {
      showError(setError, "Please fill out all required fields including difficulty, type, cuisine, and tags.");
      return;
    }

    if (!formData.image) {
      showError(setError, "Please upload an image.");
      return;
    }

    const recipeData = new FormData();

    for (const key in formData) {
      if (key === "tags") {
        recipeData.append(key, JSON.stringify(formData[key]));
      } else if (key === "image") {
        recipeData.append(key, formData.image);
      } else {
        recipeData.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/recipes`, {
        method: "POST",
        body: recipeData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        showError(setError, json.error || "Failed to add recipe to database. Please try again.");
        return;
      }

      setError(null);
      navigate("/");
    } catch (err) {
      showError(setError, "An unexpected error occurred. Please try again.");
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
        />

        <label>Time</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="Enter cooking time"
        />

        <label>Ingredients</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Write the ingredients here (separate each ingredient with enter):"
        />

        <label>Steps</label>
        <textarea
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          required
          placeholder="Write the steps here (separate each step with enter):"
        />

        <div className="section">
          <div className="row">
            <label>Difficulty</label>
            <Select
              classNamePrefix="recipe-select"
              options={Difficulty}
              placeholder="Choose difficulty:"
              onChange={(selectedOption) =>
                setFormData(prev => ({ ...prev, difficulty: selectedOption.value }))
              }
              value={
                formData.difficulty
                  ? { label: formData.difficulty, value: formData.difficulty }
                  : null
              }
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />

            <label>Type</label>
            <Select
              classNamePrefix="recipe-select"
              options={Type}
              placeholder="Choose type:"
              onChange={(selectedOption) =>
                setFormData(prev => ({ ...prev, type: selectedOption.value }))
              }
              value={
                formData.type
                  ? { label: formData.type, value: formData.type }
                  : null
              }
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div className="row">
            <label>Cuisine</label>
            <Select
              classNamePrefix="recipe-select"
              options={Cuisine}
              placeholder="Choose cuisine:"
              onChange={(selectedOption) =>
                setFormData(prev => ({ ...prev, cuisine: selectedOption.value }))
              }
              value={
                formData.cuisine
                  ? { label: formData.cuisine, value: formData.cuisine }
                  : null
              }
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />

            <label>Tags</label>
            <Select
              classNamePrefix="recipe-select"
              isMulti
              options={Tags}
              placeholder="Select tags:"
              onChange={(selectedOptions) =>
                setFormData(prev => ({
                  ...prev,
                  tags: selectedOptions ? selectedOptions.map(option => option.value) : [],
                }))
              }
              value={Tags.filter(tag => formData.tags.includes(tag.value))}
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
        </div>

        {formData.image && (
          <div className="mock-recipe-card">
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.image)} alt="Preview" />
              <p>{formData.title || "Recipe Title"}</p>
            </div>
          </div>
        )}

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

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipe;