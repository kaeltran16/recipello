import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ recipe }) => (
  <li key={recipe.id}>
     <Link
       to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
     <p>Likes: {recipe.likes}</p>
  </li>
);


export default SearchItem;
