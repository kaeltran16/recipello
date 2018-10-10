import React from 'react';
import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries';
import Error from '../Error';
import { withRouter } from 'react-router-dom';

const initialState = {
   name: '',
   instructions: '',
   category: 'Breakfast',
   description: '',
   username: ''
};

class AddRecipe extends React.Component {
   state = {
      ...initialState
   };
   clearState = () => {
      this.setState({ ...initialState });
   };
   handleChange = event => {
      const { name, value } = event.target;

      this.setState({
         [name]: value
      });
   };

   validateForm = () => {
      const { name, category, description, instructions } = this.state;
      const isValid = !name || !category || !description || !instructions;
      return isValid;
   };

   handleSubmit = (event, addRecipe) => {
      event.preventDefault();
      addRecipe().then(({ data }) => {
         console.log(data);
         this.clearState();
         this.props.history.push('/');
      });
   };
   updateCache = (cache, { data: { addRecipe } }) => {
      const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

      cache.writeQuery({
         query: GET_ALL_RECIPES,
         data: { getAllRecipes: [addRecipe, ...getAllRecipes] }
      });
   };

   componentDidMount() {
      this.setState({ username: this.props.session.getCurrentUser.username });
   }

   render() {
      const { name, category, description, instructions, username } = this.state;
      return (
        <Mutation mutation={ADD_RECIPE} variables={{
           name,
           category,
           description,
           instructions,
           username
        }} update={this.updateCache}>
           {(addRecipe, { data, loading, error }) => {

              return (
                <div className='App'>
                   <h2 className='App'>Add Recipe</h2>
                   <form className='form'
                         onSubmit={event => this.handleSubmit(event, addRecipe)}>
                      <input type="text" name='name'
                             onChange={this.handleChange}
                             placeholder='Recipe Name' value={name}/>
                      <select name='category' onChange={this.handleChange}
                              value={category}>
                         <option value="Breakfast">Breakfast</option>
                         <option value="Lunch">Lunch</option>
                         <option value="Dinner">Dinner</option>
                         <option value="Snack">Snack</option>
                      </select>
                      <input type="text" name='description'
                             onChange={this.handleChange}
                             placeholder='Add Description' value={description}/>
                      <textarea name='instructions' onChange={this.handleChange}
                                placeholder='Add Instructions'
                                value={instructions}/>
                      <button disabled={loading || this.validateForm()}
                              type='submit' className='button-primary'>Submit
                      </button>
                      {error && <Error error={error}/>}
                   </form>
                </div>
              );
           }}
        </Mutation>

      );
   }
}

export default withRouter(withSession(AddRecipe));
