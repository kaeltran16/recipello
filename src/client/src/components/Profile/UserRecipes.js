import React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
   DELETE_USER_RECIPE,
   GET_ALL_RECIPES,
   GET_CURRENT_USER,
   GET_USER_RECIPES
} from '../../queries';
import { Link } from 'react-router-dom';

const handleDelete = deleteUserRecipe => {
   const confirmDelete = window.confirm('Are you sure want to delete this recipe?');

   if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => console.log(data));
   }
};

const UserRecipes = ({ username }) => <Query query={GET_USER_RECIPES}
                                             variables={{ username }}>
   {({ data, loading, error }) => {
      if (loading) return <div>Loading</div>;
      if (error) return <div>Error</div>;
      return (
        <ul className='App'>
           <h3>Your Recipes</h3>
           {!data.getUserRecipes.length &&
           <p><strong>You have not added any recipe yet</strong></p>}
           {data.getUserRecipes.map(recipe => <li key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
              <p>Likes: {recipe.likes}</p>
              <Mutation mutation={DELETE_USER_RECIPE}
                        variables={{ id: recipe.id }}
                        refetchQueries={() => [
                           { query: GET_ALL_RECIPES },
                           { query: GET_CURRENT_USER }
                        ]}
                        update={(caches, { data: { deleteUserRecipe } }) => {
                           const { getUserRecipes } = caches.readQuery({
                              query: GET_USER_RECIPES,
                              variables: { username }
                           });

                           caches.writeQuery({
                              query: GET_USER_RECIPES,
                              variables: { username },
                              data: {
                                 getUserRecipes: getUserRecipes.filter(recipe => recipe.id !== deleteUserRecipe.id)
                              }
                           });
                        }}>
                 {(deleteUserRecipe, attrs = {}) => {
                    return (
                      <p className='delete-button'
                         style={{ marginBottom: 0 }}
                         onClick={() => handleDelete(deleteUserRecipe)}>
                         {attrs.loading ? 'deleting...' : 'X'}
                      </p>
                    );
                 }}

              </Mutation>
           </li>)}
        </ul>
      );
   }}
</Query>;

export default UserRecipes;
