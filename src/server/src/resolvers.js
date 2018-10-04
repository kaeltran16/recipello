const resolvers = {
		Query: {
				getAllRecipes: async (root, args, {RecipeModel}) => {
						const allRecipes = await RecipeModel.find();
						return allRecipes;
				}
		},
		Mutation: {
				addRecipe: async (root, args, context) => {
						const {name, description, category, instructions, username} = args;
						const {RecipeModel} = context;
						const newRecipe = await new RecipeModel({
								name,
								description,
								category,
								instructions,
								username
						}).save();
						return newRecipe;
				}
		}
};

export default resolvers;
