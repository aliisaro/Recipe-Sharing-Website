const express = require("express");
const router = express.Router();
const multer = require("multer"); // import multer
const { storage } = require("../middleware/uploadMiddleware"); // import storage middleware
const upload = multer({ storage }); // initialize multer with storage middleware
const {
  getAllRecipes,
  getRecipes,
  addRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const requireAuth = require("../requireAuth");

router.use(requireAuth);

router.get("/all", getAllRecipes);

router.get("/", getRecipes);

router.post("/", upload.single("image"), addRecipe); 

router.get("/:id", getRecipeById);

router.put("/:id", updateRecipe);

router.delete("/:id", deleteRecipe);

module.exports = router;
