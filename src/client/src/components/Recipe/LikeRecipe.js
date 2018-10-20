import React from 'react';
import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { GET_RECIPE, LIKE_RECIPE, UNLIKE_RECIPE } from '../../queries';


class LikeRecipe extends React.Component {
   state = {
      liked: false,
      username: ''
   };

   handleClick = (likeRecipe, unlikeRecipe) => {
      this.setState(prevState => ({
         liked: !prevState.liked
      }), () => this.handleLike(likeRecipe, unlikeRecipe));


   };
   handleLike = (likeRecipe, unlikeRecipe) => {
      if (this.state.liked) {
         likeRecipe().then(async ({ data }) => {
            await this.props.refetch();
         });
      } else {
         unlikeRecipe().then(async ({ data }) => {
            await this.props.refetch();
         });
      }
   };

   updateLike = (cache, { data: { likeRecipe } }) => {
      const { id } = this.props;
      const { getRecipe } = cache.readQuery({
         query: GET_RECIPE, variables: { id }
      });

      cache.writeQuery({
         query: GET_RECIPE, variables: { id },
         data: {
            getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
         }
      });
   };

   updateUnlike = (cache, { data: { unlikeRecipe } }) => {
      const { id } = this.props;
      const { getRecipe } = cache.readQuery({
         query: GET_RECIPE, variables: { id }
      });

      cache.writeQuery({
         query: GET_RECIPE, variables: { id },
         data: {
            getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
         }
      });
   };

   componentDidMount() {
      const { session: { getCurrentUser } } = this.props;
      const { id } = this.props;
      if (getCurrentUser) {
         const { username, favorites } = getCurrentUser;
         const prevLiked = favorites.findIndex(fav => fav.id === id) > -1;
         this.setState({
            username,
            liked: prevLiked
         });
      }
   }

   render() {
      const { username, liked } = this.state;
      const { id } = this.props;
      return (
        <Mutation mutation={UNLIKE_RECIPE} variables={{ id, username }}
                  update={this.updateUnlike}
        >
           {(unlikeRecipe) => {
              return (
                <Mutation mutation={LIKE_RECIPE} variables={{ id, username }}
                          update={this.updateLike}>
                   {(likeRecipe) => {
                      return (
                        username && <button
                          className='like-button'
                          onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}>
                           {liked ? 'Liked' : 'Like'}
                        </button>
                      );
                   }}
                </Mutation>
              );
           }}

        </Mutation>
      );
   }
}

export default withSession(LikeRecipe);
