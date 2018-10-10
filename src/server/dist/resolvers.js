'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwt = require('jsonwebtoken');


const createToken = (user, secret, expiresIn) => {
   const { username, email } = user;
   return jwt.sign({ username, email }, secret, { expiresIn });
};

const resolvers = {
   Query: {
      getAllRecipes: async (root, args, { RecipeModel }) => {
         const allRecipes = await RecipeModel.find();
         return allRecipes;
      },

      getCurrentUser: async (root, args, { currentUser, UserModel }) => {
         if (!currentUser) {
            return null;
         }
         const user = await UserModel.find({ username: currentUser.username }).populate({
            path: 'favorites',
            model: 'Recipe'
         });

         return user;
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

         const isValidPassword = await _bcryptjs2.default.compare(password, user.password);
         if (!isValidPassword) {
            throw new Error('Invalid password');
         }

         return { token: createToken(user, process.env.SECRET, '1hr') };
      }
   }
};

exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map