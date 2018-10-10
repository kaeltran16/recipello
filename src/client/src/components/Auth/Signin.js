import React from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../../queries';
import Error from '../Error';
import { withRouter } from 'react-router-dom';

const initialState = {
   username: '',
   password: ''
};

class Signin extends React.Component {
   state = {
      ...initialState
   };

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({
         [name]: value
      });
   };

   clearState = () => {
      this.setState({ ...initialState });
   };

   handleSubmit = (event, signinUser) => {
      event.preventDefault();
      signinUser().then(async ({ data }) => {
         console.log(data);
         localStorage.setItem('token', data.signinUser.token);
         await this.props.refetch();
         this.clearState();
         this.props.history.push('/');
      });
   };

   validateForm = () => {
      const { username, password } = this.state;

      const isInvalid = !username || !password;
      return isInvalid;
   };

   render() {
      const { username, password } = this.state;
      return (
        <div className="App">
           <h2 className="App">Signin</h2>
           <Mutation mutation={SIGNIN_USER}
                     variables={{ username, password }}>
              {(signinUser, { data, loading, error }) => {
                 return (
                   <form
                     onSubmit={event => this.handleSubmit(event, signinUser)}
                     className="form">
                      <input type="text" name="username" placeholder="Username"
                             onChange={this.handleChange} value={username}/>
                      <input type="password" name="password"
                             placeholder="Password"
                             onChange={this.handleChange} value={password}/>
                      <button disabled={loading || this.validateForm()}
                              type='submit'
                              className="button-primary">
                         Submit
                      </button>
                      {error && <Error error={error}/>}
                   </form>
                 );
              }}
           </Mutation>
        </div>
      );
   }
}


export default withRouter(Signin);
