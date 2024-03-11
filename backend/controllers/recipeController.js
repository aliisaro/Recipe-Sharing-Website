const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

// get all Recipes
const getRecipes = async (req, res) => {
  const user_id = req.user._id;

  try {
    const Recipes = await Recipe.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(Recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Add one Recipe
const addRecipe = async (req, res) => {
  const {
    title,
    ingredients,
    steps,
    time,
    difficulty,
    image,
    type,
    cuisine,
    tags,
    rating,
    user_id,
  } = req.body;

  try {
    const user_id = req.user._id;
    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      time,
      difficulty,
      image,
      type,
      cuisine,
      tags,
      rating,
      user_id,
    });


    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
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
    const recipe = await Recipe.findById(id).where("user_id").equals(user_id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update Recipe by ID
const updateRecipe = async (req, res) => {
  const id = req.params.id;
  try {
    const user_id = req.user._id;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Recipe by ID
const deleteRecipe = async (req, res) => {
  const id = req.params.id;
  try {
    const user_id = req.user._id;
    const recipe = await Recipe.findByIdAndDelete({
      _id: id,
      user_id: user_id,
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getRecipes,
  addRecipe,
  getRecipeById,
  deleteRecipe,
  updateRecipe,
};
