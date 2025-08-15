import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => (
  <div key={recipe._id} className="recipe-card">
    <Link to={`/${recipe._id}`}>
      <div className="image-container">
        <img src={recipe.image} alt={recipe.title} />
        <p>{recipe.title}</p>
      </div>
    </Link>
  </div>
);

export default RecipeCard;
