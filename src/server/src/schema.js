const typeDefs = `
	type Recipe {
		id: ID
		name: String!
		category: String!
		description: String!
		instructions: String!
		createdDate: String!
		likes: Int
		username: String
	}
	
	type User {
		id: ID
		username: String!
		password: String!
		email: String!
		joinDate: String
		favorites: [Recipe]
	}
	
    type Token {
	    token: String!  
	}
	
	type Query {
		getAllRecipes: [Recipe]
		
		getCurrentUser: User
		
		getRecipe(id: ID!): Recipe
		searchRecipe(searchTerm: String): [Recipe]
		getUserRecipes(username: String!): [Recipe]
	}
	
	type Mutation {
		addRecipe(name: String!, description: String!, category: String!,
		 instructions: String!, username: String): Recipe
		 
		signupUser(username: String!, email: String!, password: String!): Token
		
		signinUser(username: String!, password: String!): Token
		
		deleteUserRecipe(id: ID!): Recipe
		likeRecipe(id: ID!, username: String!): Recipe
		unlikeRecipe(id: ID!, username: String!): Recipe
	}

`;

export default typeDefs;
