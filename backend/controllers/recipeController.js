const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Recipe = require("../models/Recipe");
const User = require("../models/Users");
const { getGFS } = require("../config/gfs");

// Get all recipes by all users, with optional filters
const getAllRecipes = async (req, res) => {
  try {
    const { type, cuisine, tags, search} = req.query;

    // Build the filter object dynamically based on query params
    const filter = {};

    if (type && type !== 'none') {
      filter.type = type;
    }
    if (cuisine && cuisine !== 'none') {
      filter.cuisine = cuisine;
    }

    if (tags && tags !== 'none') {
      // Assume tags query param is a comma separated string, e.g. "vegan,gluten free"
      const tagsArray = tags.split(',').map(tag => tag.trim());

      // Filter recipes that have any of the tags in their tags array
      filter.tags = { $in: tagsArray };
    }
    
    if (search) {
      // Perform case-insensitive partial match on title or ingredients or steps, etc.
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
        { steps: { $regex: search, $options: "i" } },
      ];
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


// Get all Recipes by single user
const getRecipesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, cuisine, tags, search} = req.query;

    // Build the filter object dynamically based on query params
    const filter = {};

    if (type && type !== 'none') {
      filter.type = type;
    }
    if (cuisine && cuisine !== 'none') {
      filter.cuisine = cuisine;
    }

    if (tags && tags !== 'none') {
      // Assume tags query param is a comma separated string, e.g. "vegan,gluten free"
      const tagsArray = tags.split(',').map(tag => tag.trim());

      // Filter recipes that have any of the tags in their tags array
      filter.tags = { $in: tagsArray };
    }

    if (search) {
      // Perform case-insensitive partial match on title or ingredients or steps, etc.
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
        { steps: { $regex: search, $options: "i" } },
      ];
    }

    // Find recipes created by the user with the specified filters
    const user = await User.findById(userId);
    filter._id = { $in: user.createdRecipes };

    const createdRecipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.status(200).json(createdRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user's recipes" });
  }
};

// Get all saved recipes by current user with filters and search
const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, cuisine, tags, search } = req.query;

    // Build the filter object dynamically based on query params
    const filter = {};

    if (type && type !== 'none') {
      filter.type = type;
    }
    if (cuisine && cuisine !== 'none') {
      filter.cuisine = cuisine;
    }

    if (tags && tags !== 'none') {
      // Assume tags query param is a comma separated string, e.g. "vegan,gluten free"
      const tagsArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
        { steps: { $regex: search, $options: "i" } },
      ];
    }

    const user = await User.findById(userId);
    filter._id = { $in: user.savedRecipes };

    const savedRecipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.status(200).json(savedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get saved recipes" });
  }
};

// Get Recipe by ID
const getRecipeById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID / no such recipe" });
  }

  try {
    const user_id = req.user._id;
    const recipe = await Recipe.findById(id).populate('user_id');
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const userRating = recipe.rating.ratings.find(r => r.user.toString() === user_id.toString())?.value;

    res.status(200).json({
      ...recipe.toObject(), // convert Mongoose doc to plain object
      rating: {
        ...recipe.rating.toObject(),
        userRating: userRating || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Add a new recipe
const addRecipe = async (req, res) => {
  try {
    const user_id = req.user._id;
    const {
      title,
      ingredients,
      steps,
      time,
      difficulty,
      type,
      cuisine,
      tags
    } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = req.file.filename;  // filename from multer
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      time,
      difficulty,
      image: imagePath,
      type,
      cuisine,
      tags,
      user_id
    });

    await newRecipe.save();

    const user = await User.findById(user_id);
    user.createdRecipes.push(newRecipe._id);
    await user.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error in addRecipe:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user._id;

  try {
    const recipe = await Recipe.findOne({ _id: id, user_id });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (req.file) {
      // Delete old local image file if exists
      if (recipe.image) {
        try {
          await fs.promises.unlink(path.join(__dirname, "..", "uploads", recipe.image));
        } catch (err) {
          console.error("Error deleting old local image:", err);
        }
      }
      recipe.image = req.file.filename;
    }

    const allowedFields = [
      "title",
      "ingredients",
      "steps",
      "time",
      "difficulty",
      "type",
      "cuisine",
      "tags"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        recipe[field] = typeof req.body[field] === "string"
          ? JSON.parse(req.body[field] || '""')
          : req.body[field];
      }
    });

    await recipe.save();
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user._id;

  try {
    const recipe = await Recipe.findOne({ _id: id, user_id });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete local image file
    if (recipe.image) {
      try {
        await fs.promises.unlink(path.join(__dirname, "..", "uploads", recipe.image));
      } catch (err) {
        console.error("Error deleting local file:", err);
      }
    }

    await Recipe.deleteOne({ _id: id, user_id });

    // Remove from user's createdRecipes
    await User.findByIdAndUpdate(user_id, { $pull: { createdRecipes: id } });

    // Remove from all users' savedRecipes
    await User.updateMany(
      { savedRecipes: id },
      { $pull: { savedRecipes: id } }
    );

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// save recipe to library
const saveRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

  if (!user.savedRecipes.some(id => id.toString() === recipeId)) {
    user.savedRecipes.push(recipeId);
    await user.save();
  }

    res.status(200).json({ message: "Recipe saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

// unsave recipe from library
const unsaveRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe unsaved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unsave recipe" });
  }
};

// Rate a recipe
const rateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;
    const { value } = req.body;

    if (value < 1 || value > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // Check if user already rated
    const existingRating = recipe.rating.ratings.find((r) => r.user.toString() === userId.toString());

    if (existingRating) {
      existingRating.value = value;
    } else {
      recipe.rating.ratings.push({ user: userId, value });
      recipe.rating.count += 1;
    }

    // Recalculate average
    const total = recipe.rating.ratings.reduce((sum, r) => sum + r.value, 0);
    recipe.rating.average = total / recipe.rating.ratings.length;

    await recipe.save();

    // Get the user's rating for the response
    const userRating = recipe.rating.ratings.find(r => r.user.toString() === userId.toString())?.value;

    res.status(200).json({
      average: recipe.rating.average,
      count: recipe.rating.count,
      userRating,
      message: "Rating submitted successfully.",
    });

  } catch (error) {
    console.error("Error rating recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllRecipes,
  getRecipesByUser,
  addRecipe,
  getRecipeById,
  deleteRecipe,
  updateRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  rateRecipe
};
