import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {
   BrowserRouter as Router,
   Redirect,
   Route,
   Switch
} from 'react-router-dom';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import withSession from './components/withSession';
import NavBar from './components/NavBar';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile';
import RecipePage from './components/Recipe/RecipePage';

const client = new ApolloClient({
   uri: 'https://recipello.herokuapp.com/graphql',
   fetchOptions: {
      credentials: 'include'
   },
   request: operation => {
      const token = localStorage.getItem('token');
      operation.setContext({
         headers: {
            authorization: token
         }
      });
   },
   onError: ({ networkError }) => {
      if (networkError) {
         console.log('Network error', networkError);

         if (networkError.statusCode === 401) {
            localStorage.removeItem('token');
         }
      }
   }
});

const Root = ({ refetch, session }) => (
  <Router>
     <Fragment>
        <NavBar session={session}/>
        <Switch>
           <Route exact path='/' component={App}/>
           <Route path='/search' component={Search}/>
           <Route path='/signin' render={() => <Signin refetch={refetch}/>}/>
           <Route path='/signup' render={() => <Signup refetch={refetch}/>}/>
           <Route path='/recipe/add' component={AddRecipe}/>
           <Route path='/recipe/:id' component={RecipePage}/>
           <Route path='/profile' component={Profile}/>
           <Redirect to='/'/>
        </Switch>
     </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);
ReactDOM.render(
  <ApolloProvider client={client}>
     <RootWithSession/>
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
