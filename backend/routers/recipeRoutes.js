const express = require("express");
const router = express.Router();
const multer = require("multer"); // import multer

// Old code for multer upload
const { storage } = require("../middleware/uploadMiddleware");
const upload = multer({ storage }); // initialize multer with storage middleware

// Import GridFS upload middleware
const uploadGridFS = require("../middleware/gridFSpload");

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
router.post("/", uploadGridFS.single("image"), addRecipe); 
//router.post("/", upload.single("image"), addRecipe); // Old code for multer upload

// then the param route:
router.get("/:id", getRecipeById);
router.put("/:id",  uploadGridFS.single("image"), updateRecipe);
//router.put("/:id",  upload.single("image"), updateRecipe); // Old code for multer upload
router.delete("/:id", deleteRecipe);
router.post("/save/:id", saveRecipe);
router.delete("/unsave/:id", unsaveRecipe);
router.post("/rate/:id", rateRecipe);

module.exports = router;
