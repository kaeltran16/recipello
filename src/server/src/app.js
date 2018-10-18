import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
import { UserModel } from './models/User';
import { RecipeModel } from './models/Recipe';
import jwt from 'jsonwebtoken';

const path = require('path');

const schema = makeExecutableSchema({
   typeDefs,
   resolvers
});

const app = express();
app.use(async (req, res, next) => {
   const token = req.headers['authorization'];
   if (token !== 'null' && token !== undefined) {
      try {
         const currentUser = await jwt.verify(token, process.env.SECRET);
         req.currentUser = currentUser;
      } catch (err) {
         console.error(err);
      }
   }
   next();
});


const server = new ApolloServer({
   schema,
   context: ({ req }) => {
      const { currentUser } = req;
      return {
         UserModel,
         RecipeModel,
         currentUser
      };

   }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));

   app.get('*', (req, res) => {
      res.sendFile(path.resolve('/app/src/', 'client', 'build', 'index.html'));
   });
}


server.applyMiddleware({ app });
export default app;
