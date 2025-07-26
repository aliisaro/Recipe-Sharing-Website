const express = require("express");
const router = express.Router();
const multer = require("multer"); // import multer
const { storage } = require("../middleware/uploadMiddleware"); // import storage middleware
const upload = multer({ storage }); // initialize multer with storage middleware
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
} = require("../controllers/recipeController");

const requireAuth = require("../requireAuth");

router.use(requireAuth);

router.get("/all", getAllRecipes);
router.get("/user", getRecipesByUser);
router.get("/saved", getSavedRecipes);
router.post("/", upload.single("image"), addRecipe); 

// then the param route:
router.get("/:id", getRecipeById);
router.put("/:id",  upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/save/:id", saveRecipe);
router.delete("/unsave/:id", unsaveRecipe);

module.exports = router;
