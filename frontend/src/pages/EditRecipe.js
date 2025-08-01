import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { API_URL } from '../config';
import { Difficulty, Type, Cuisine, Tags } from '../data/recipeOptions'; // Removed TimeOptions import

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    time: "",
    difficulty: null,
    image: null,
    type: null,
    cuisine: null,
    tags: [],
  });

  // Fetch recipe by ID
  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch recipe");

        const data = await response.json();

        setFormData({
          ...data,
          time: data.time || "", // keep as string
          difficulty: Difficulty.find(opt => opt.value === data.difficulty) || null,
          type: Type.find(opt => opt.value === data.type) || null,
          cuisine: Cuisine.find(opt => opt.value === data.cuisine) || null,
          tags: (data.tags || []).map(tag =>
            Tags.find(t => t.value === tag) || { value: tag, label: tag }
          ),
          image: data.image || null,
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to fetch recipe");
      }
    };

    getRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedData = {
      ...formData,
      difficulty: formData.difficulty ? formData.difficulty.value : null,
      type: formData.type ? formData.type.value : null,
      cuisine: formData.cuisine ? formData.cuisine.value : null,
      tags: Array.isArray(formData.tags)
        ? formData.tags.map(tag => (typeof tag === "string" ? tag : tag.value))
        : [],
    };

    const recipeData = new FormData();

    for (const key in formattedData) {
      const value = formattedData[key];

      if (key === "image") {
        if (value instanceof File) {
          recipeData.append("image", value, value.name);
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

      if (!response.ok) throw new Error("Failed to update recipe");


      const updatedRecipe = await response.json();
      setError(null);
      console.log("Updated recipe:", updatedRecipe);
      navigate(`/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError(error.message || "An error occurred while updating the recipe.");
    }
  };

  return (
    <div className="edit-recipe-page-container">
      <form
        className="edit-recipe-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1>Edit Recipe</h1>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
        />

        <label>Time:</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="Enter cooking time"
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

        <div className="section">
          <div className="row">
            <label>Difficulty:</label>
            <Select
              classNamePrefix="recipe-select"
              options={Difficulty}
              value={formData.difficulty}
              onChange={selected => setFormData(prev => ({ ...prev, difficulty: selected }))}
            />

            <label>Type:</label>
            <Select
              classNamePrefix="recipe-select"
              options={Type}
              value={formData.type}
              onChange={selected => setFormData(prev => ({ ...prev, type: selected }))}
            />
          </div>

          <div className="row">
            <label>Cuisine:</label>
            <Select
              classNamePrefix="recipe-select"
              options={Cuisine}
              value={formData.cuisine}
              onChange={selected => setFormData(prev => ({ ...prev, cuisine: selected }))}
            />

            <label>Tags:</label>
            <Select
              classNamePrefix="recipe-select"
              isMulti
              options={Tags}
              onChange={selectedOptions => setFormData(prev => ({ ...prev, tags: selectedOptions }))}
              value={formData.tags}
            />
          </div>
        </div>

        {formData.image && (
          <div className="mock-recipe-card">
            <div className="image-preview">
              <img
                src={
                  formData.image instanceof File
                    ? URL.createObjectURL(formData.image)
                    : formData.image
                }
                alt="Preview"
              />
              <p>{formData.title || "Recipe Title"}</p>
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

        {error && <div className="error-message">{error}</div>}

        <div className="edit-cancel-buttons">
          <button type="submit">Done</button>
          <button type="button" onClick={() => navigate(`/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;