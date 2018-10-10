import React from 'react';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import { withRouter } from 'react-router-dom';

const RecipePage = ({ match }) => {
   const { id } = match.params;
   return (
     <Query query={GET_RECIPE} variables={{ id }}>
        {({ data, loading, error }) => {
           if (loading) return <div>Loading..</div>;
           if (error) return <div>Error</div>;
           console.log(data);
           return (
             <div className='App'>
                <h2>Category: {data.getRecipe.name}</h2>
                <p>Description: {data.getRecipe.description}</p>
                <p>Instructions: {data.getRecipe.instructions}</p>
                <p>Likes: {data.getRecipe.likes}</p>
                <p>Created By: {data.getRecipe.username}</p>
                <button>Like</button>
             </div>
           );
        }}
     </Query>

   );
};

export default withRouter(RecipePage);