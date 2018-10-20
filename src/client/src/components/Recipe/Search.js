import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { SEARCH_RECIPE } from '../../queries';
import SearchItem from './SearchItem';

class Search extends React.Component {
   handleChange = data => {
      this.setState({ searchResult: data.searchRecipe });
   };

   state = {
      searchResult: []
   };

   render() {
      const { searchResult } = this.state;
      return (
        <ApolloConsumer>
           {client => {
              return (
                <div className='App'>
                   <input className='search' type="search"
                          placeholder='Search for recipes'
                          onChange={async event => {
                             event.persist();
                             const { data } = await client.query({
                                query: SEARCH_RECIPE,
                                variables: { searchTerm: event.target.value }
                             });
                             this.handleChange(data);
                          }}/>
                   <ul>
                      {searchResult.map(recipe =>
                        <SearchItem recipe={recipe}/>
                      )}
                   </ul>
                </div>
              );
           }}
        </ApolloConsumer>
      );
   }
}

export default Search;
