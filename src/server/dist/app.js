'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _apolloServerExpress = require('apollo-server-express');

var _graphqlTools = require('graphql-tools');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _User = require('./models/User');

var _Recipe = require('./models/Recipe');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = (0, _graphqlTools.makeExecutableSchema)({
   typeDefs: _schema2.default,
   resolvers: _resolvers2.default
});

const app = (0, _express2.default)();
app.use(async (req, res, next) => {
   const token = req.headers['authorization'];
   if (token !== 'null' && token !== undefined) {
      try {
         const currentUser = await _jsonwebtoken2.default.verify(token, process.env.SECRET);
         req.currentUser = currentUser;
      } catch (err) {
         console.error(err);
      }
   }
   next();
});

const server = new _apolloServerExpress.ApolloServer({
   schema,
   context: ({ req }) => {
      const { currentUser } = req;
      return {
         UserModel: _User.UserModel,
         RecipeModel: _Recipe.RecipeModel,
         currentUser
      };
   }
});

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

_mongoose2.default.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => console.log('Database connected')).catch(err => console.log(err));

server.applyMiddleware({ app });
exports.default = app;
//# sourceMappingURL=app.js.map