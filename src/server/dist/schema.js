'use strict';

Object.defineProperty(exports, '__esModule', {
   value: true
});
const typeDefs = `
	type Recipe {
		id: ID
		name: String!
		imgUrl: String!
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
	}
	
	type Mutation {
		addRecipe(name: String!, imgUrl: String!, description: String!, category: String!,
		 instructions: String!, username: String): Recipe
		 
		signupUser(username: String!, email: String!, password: String!): Token
		
		signinUser(username: String!, password: String!): Token
		updateUserRecipe(id: ID!, name: String!, imgUrl: String!, description: String!, category: String!,
		 instructions: String!): Recipe
	}

`;

exports.default = typeDefs;
//# sourceMappingURL=schema.js.map
