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
      }
   },
   Mutation: {
      addRecipe: async (root, args, context) => {
         const { name, description, category, instructions, username } = args;
         const { RecipeModel } = context;
         const newRecipe = await new RecipeModel({
            name,
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
      }
   }
};

export default resolvers;
