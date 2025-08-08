import { Link } from "react-router-dom";
import { API_URL } from '../config';

const RecipeCard = ({ recipe }) => (
  <div key={recipe._id} className="recipe-card">
    <Link to={`/${recipe._id}`}>
      <div className="image-container">
        {/*<img src={`${API_URL}/${recipe.image}`} alt={recipe.title} />*/}
        <img src={`${API_URL}/files/${recipe.image}`} alt={recipe.title} />
        <p>{recipe.title}</p>
      </div>
    </Link>
  </div>
);

export default RecipeCard;