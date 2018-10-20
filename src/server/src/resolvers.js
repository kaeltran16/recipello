const jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';

const createToken = (user, secret, expiresIn) => {
   const { username, email } = user;
   return jwt.sign({ username, email }, secret, { expiresIn });
};

const resolvers = {
   Query: {
      getAllRecipes: async (root, args, { RecipeModel }) => {
         const allRecipes = await RecipeModel.find().sort({ createdDate: 'desc' });
         return allRecipes;
      },

      getCurrentUser: async (root, args, { currentUser, UserModel }) => {
         if (!currentUser) {
            return null;
         }
         const user = await UserModel.findOne({ username: currentUser.username })
           .populate({
              path: 'favorites',
              model: 'Recipe'
           });

         return user;


      },

      getRecipe: async (root, { id }, { RecipeModel }) => {
         const recipe = await RecipeModel.findOne({ _id: id });
         return recipe;
      },

      searchRecipe: async (root, { searchTerm }, { RecipeModel }) => {
         if (searchTerm) {
            const searchResults = await RecipeModel.find({
               $text: { $search: searchTerm }
            }, {
               score: { $meta: 'textScore' }
            }).sort({
               score: { $meta: 'textScore' }
            });
            return searchResults;
         } else {
            const recipes = RecipeModel.find().sort({
               likes: 'desc',
               createdDate: 'desc'
            });
            return recipes;
         }
      },

      getUserRecipes: async (root, { username }, { RecipeModel }) => {
         const userRecipes = await RecipeModel.find({ username }).sort({
            createdDate: 'desc'
         });
         return userRecipes;
      }
   },
   Mutation: {
      addRecipe: async (root, args, context) => {
         const { name, imgUrl, description, category, instructions, username } = args;
         const { RecipeModel } = context;
         const newRecipe = await new RecipeModel({
            name,
            imgUrl,
            description,
            category,
            instructions,
            username
         }).save();
         return newRecipe;
      },

      signupUser: async (root, { username, email, password }, { UserModel }) => {
         const user = await UserModel.findOne({ username });
         if (user) {
            throw new Error('User already existed');
         }

         const newUser = await new UserModel({
            username,
            email,
            password
         }).save();

         return { token: createToken(newUser, process.env.SECRET, '1hr') };
      },

      signinUser: async (root, { username, password }, { UserModel }) => {
         const user = await UserModel.findOne({ username });
         if (!user) {
            throw new Error('User not found');
         }

         const isValidPassword = await bcrypt.compare(password, user.password);
         if (!isValidPassword) {
            throw new Error('Invalid password');
         }

         return { token: createToken(user, process.env.SECRET, '1hr') };
      },

      deleteUserRecipe: async (root, { id }, { RecipeModel }) => {
         const recipe = await RecipeModel.findOneAndDelete({ _id: id });
         return recipe;
      },
      likeRecipe: async (root, { id, username }, { RecipeModel, UserModel }) => {
         const recipe = await RecipeModel.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 } });
         const user = await UserModel.findOneAndUpdate({ username }, { $addToSet: { favorites: id } });
         return recipe;
      },
      unlikeRecipe: async (root, { id, username }, { RecipeModel, UserModel }) => {
         const recipe = await RecipeModel.findOneAndUpdate({ _id: id }, { $inc: { likes: -1 } });
         const user = await UserModel.findOneAndUpdate({ username }, { $pull: { favorites: id } });
         return recipe;
      },
      updateUserRecipe: async (root, args, context) => {
         const { id, name, imgUrl, description, category, instructions } = args;
         const { RecipeModel } = context;
         const updatedRecipe = await RecipeModel.findOneAndUpdate(
           { _id: id },
           { $set: { name, imgUrl, description, category, instructions } },
           { new: true }
         );
         console.log(updatedRecipe);

         return updatedRecipe;
      }
   }
};

export default resolvers;
