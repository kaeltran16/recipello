import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {ApolloServer} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
import {UserModel} from './models/User';
import {RecipeModel} from './models/Recipe';

const schema = makeExecutableSchema({
		typeDefs,
		resolvers
});

const app = express();

const server = new ApolloServer({
		schema,
		context: {
				UserModel,
				RecipeModel
		}
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
		.then(() => console.log('Database connected'))
		.catch((err) => console.log(err));

server.applyMiddleware({app});
export default app;
