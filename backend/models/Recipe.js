const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: { 
        type: String, required: true 
    },
    ingredients: { 
        type: String, required: true 
    },
    steps: { 
        type: String, required: true 
    },
    time: { 
        type: String, required: true 
    },
    difficulty: { 
        type: String, required: true 
    },
    image: {
        type: String, required: false
    },
    type: {
        type: String, required: true
    },
    cuisine: {
        type: String, required: false
    },
    tags: [{
        type: String, required: false 
    }],
    rating: {
        type: Number, required: false 
    },
    user_id: { 
        type: String, required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
