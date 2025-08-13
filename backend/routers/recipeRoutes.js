const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // import multer instance

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
router.post("/", upload.single("image"), addRecipe); // file will be stored

router.get("/:id", getRecipeById);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/save/:id", saveRecipe);
router.delete("/unsave/:id", unsaveRecipe);
router.post("/rate/:id", rateRecipe);

module.exports = router;
