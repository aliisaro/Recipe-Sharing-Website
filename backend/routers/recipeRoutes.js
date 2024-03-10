const express = require("express");
const router = express.Router();
const {
  getRecipes,
  addRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const requireAuth = require("../requireAuth");

// require auth for all workout routes
router.use(requireAuth);

// get all Recipes
router.get("/", getRecipes);

// Add one Recipe
router.post("/", addRecipe);

// Get Recipe by ID
router.get("/:id", getRecipeById);

// Update Recipe by ID PUT
router.put("/:id", updateRecipe);

// Delete Recipe by ID
router.delete("/:id", deleteRecipe);

module.exports = router;
