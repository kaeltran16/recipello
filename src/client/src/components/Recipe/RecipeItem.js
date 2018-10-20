import React from 'react';
import { Link } from 'react-router-dom';
import posed from 'react-pose';

const Recipe = posed.li({
   shown: {
      opacity: 1
   },
   hidden: {
      opacity: 0
   }
});

const RecipeItem = ({ recipe }) => (
  <Recipe className='card'
          style={{ background: `url(${recipe.imgUrl}) center/cover no-repeat` }}>
     <span className={recipe.category}>{recipe.category}</span>
     <div className='card-text'>
        <Link to={`/recipe/${recipe.id}`}>
           <h4>{recipe.name}</h4>
        </Link>
     </div>

  </Recipe>
);

export default RecipeItem;
