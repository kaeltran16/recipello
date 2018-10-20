import React from 'react';
import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';
import { withRouter } from 'react-router-dom';
import withAuth from '../../withAuth';
import CKEditor from 'react-ckeditor-component';

const initialState = {
   name: '',
   instructions: '',
   category: 'Breakfast',
   description: '',
   username: '',
   imgUrl: ''
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

   handleEditorChange = e => {
      const newContent = e.editor.getData();
      this.setState({ instructions: newContent });
   };

   validateForm = () => {
      const { name, category, description, instructions, imgUrl } = this.state;
      const isValid = !name || !imgUrl || !category || !description || !instructions;
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
      const { name, imgUrl, category, description, instructions, username } = this.state;
      return (
        <Mutation mutation={ADD_RECIPE} variables={{
           name,
           imgUrl,
           category,
           description,
           instructions,
           username
        }}
                  refetchQueries={() => [
                     { query: GET_USER_RECIPES, variables: { username } }
                  ]}
                  update={this.updateCache}>
           {(addRecipe, { data, loading, error }) => {

              return (
                <div className='App'>
                   <h2 className='App'>Add Recipe</h2>
                   <form className='form'
                         onSubmit={event => this.handleSubmit(event, addRecipe)}>
                      <input type="text" name='name'
                             onChange={this.handleChange}
                             placeholder='Recipe Name' value={name}/>
                      <input type="text" name='imgUrl'
                             onChange={this.handleChange}
                             placeholder='Recipe Image' value={imgUrl}/>
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
                      <label htmlFor='instructions'>Add Instructions</label>
                      <CKEditor name='instructions' content={instructions}
                                events={{ change: this.handleEditorChange }}/>
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

export default withAuth(session => session && session.getCurrentUser)(withRouter(withSession(AddRecipe)));
