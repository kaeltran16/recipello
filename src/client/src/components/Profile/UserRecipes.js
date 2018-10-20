import React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
   DELETE_USER_RECIPE,
   GET_ALL_RECIPES,
   GET_CURRENT_USER,
   GET_USER_RECIPES,
   UPDATE_USER_RECIPE
} from '../../queries';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';


class UserRecipes extends React.Component {
   state = {
      name: '',
      imgUrl: '',
      category: '',
      description: '',
      instructions: '',
      modal: false
   };
   handleDelete = deleteUserRecipe => {
      const confirmDelete = window.confirm('Are you sure want to delete this recipe?');

      if (confirmDelete) {
         deleteUserRecipe().then(({ data }) => console.log(data));
      }
   };

   closeModal = () => {
      this.setState({ modal: false });
   };

   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   };

   loadRecipe = recipe => {
      this.setState({ ...recipe, modal: true });
   };

   handleSubmit = (event, updateUserRecipe) => {
      event.preventDefault();
      updateUserRecipe().then(({ data }) => {
         console.log(data);
         this.closeModal();
      });
   };

   render() {
      const { username } = this.props;
      const { modal } = this.state;
      return (
        <Query query={GET_USER_RECIPES}
               variables={{ username }}>
           {({ data, loading, error }) => {
              if (loading) return <Spinner/>;
              if (error) return <div>Error</div>;
              return (
                <ul className='App'>
                   {modal && <EditRecipeModel recipe={this.state}
                                              closeModal={this.closeModal}
                                              handleChange={this.handleChange}
                                              handleSubmit={this.handleSubmit}/>}
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
                              <div>
                                 <button className='button-primary'
                                         onClick={() => this.loadRecipe(recipe)}>
                                    Update
                                 </button>
                                 <p className='delete-button'
                                    style={{ marginBottom: 0 }}
                                    onClick={() => this.handleDelete(deleteUserRecipe)}>
                                    {attrs.loading ? 'deleting...' : 'X'}
                                 </p>
                              </div>
                            );
                         }}

                      </Mutation>
                   </li>)}
                </ul>
              );
           }}
        </Query>
      );
   }
}

const EditRecipeModel = ({ handleSubmit, handleChange, closeModal, recipe }) => (
  <Mutation mutation={UPDATE_USER_RECIPE} variables={{
     id: recipe.id,
     name: recipe.name,
     imgUrl: recipe.imgUrl,
     category: recipe.category,
     description: recipe.description,
     instructions: recipe.instructions
  }}>
     {(updateUserRecipe) => {
        return (
          <div className='modal modal-open'>
             <div className='modal-inner'>
                <div className='modal-content'>
                   <form
                     onSubmit={event => handleSubmit(event, updateUserRecipe)}
                     className='modal-content-inner'>
                      <h4>Edit Recipe</h4>
                      <label htmlFor='name'>Name</label>
                      <input type="text" name='name'
                             onChange={handleChange} value={recipe.name}/>
                      <label htmlFor='imgUrl'>Image</label>
                      <input type="text" name='imgUrl'
                             onChange={handleChange} value={recipe.imgUrl}/>
                      <label htmlFor='category'>Category</label>
                      <select name='category' onChange={handleChange}
                              value={recipe.category}>
                         <option value="Breakfast">Breakfast</option>
                         <option value="Lunch">Lunch</option>
                         <option value="Dinner">Dinner</option>
                         <option value="Snack">Snack</option>
                      </select>
                      <label htmlFor='description'>Description</label>
                      <input type="text" name='description'
                             onChange={handleChange}
                             value={recipe.description}/>
                      <label htmlFor='instructions'>Add Instructions</label>
                      <input type="text" name='instructions'
                             onChange={handleChange}
                             value={recipe.instructions}/>
                      <hr/>
                      <div className='modal-buttons'>
                         <button className='button-primary' type='submit'>Update
                         </button>
                         <button onClick={closeModal}>Cancel</button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
        );
     }}
  </Mutation>
);


export default UserRecipes;
