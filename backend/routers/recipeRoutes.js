const express = require("express");
const router = express.Router();
app.use(express.json({ limit: "10mb" })); // increase limit for Base64
//const upload = require("../middleware/uploadMiddleware");

const {
  getAllRecipes,
  getRecipesByUser,
  addRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  rateRecipe
} = require("../controllers/recipeController");

const requireAuth = require("../requireAuth");

router.use(requireAuth);

router.get("/all", getAllRecipes);
router.get("/user", getRecipesByUser);
router.get("/saved", getSavedRecipes);
router.post("/", addRecipe);

router.get("/:id", getRecipeById);
router.put("/:id",  updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/save/:id", saveRecipe);
router.delete("/unsave/:id", unsaveRecipe);
router.post("/rate/:id", rateRecipe);

module.exports = router;
