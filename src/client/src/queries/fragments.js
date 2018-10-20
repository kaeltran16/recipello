import { gql } from 'apollo-boost';

export const recipeFragments = {
   recipe: gql`
       fragment CompleteRecipe on Recipe {
           id
           name
           imgUrl
           category
           description
           instructions
           createdDate
           likes,
           username
       }
   `
};
