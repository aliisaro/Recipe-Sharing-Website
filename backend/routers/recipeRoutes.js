const express = require("express");
const router = express.Router();
const multer = require("multer"); // import multer

const { storage } = require("../middleware/uploadMiddleware");
const upload = multer({ storage }); // initialize multer with storage middleware
const { uploadSingle, setStorageType } = require("../middleware/gridFSupload");

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
router.post("/", uploadSingle, setStorageType, addRecipe);
//router.post("/", upload.single("image"), addRecipe);

// then the param route:
router.get("/:id", getRecipeById);
router.put("/:id", uploadSingle, setStorageType, updateRecipe);
//router.put("/", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/save/:id", saveRecipe);
router.delete("/unsave/:id", unsaveRecipe);
router.post("/rate/:id", rateRecipe);

module.exports = router;
