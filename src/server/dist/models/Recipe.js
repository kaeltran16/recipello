'use strict';

Object.defineProperty(exports, '__esModule', {
   value: true
});
exports.RecipeModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

const Schema = _mongoose2.default.Schema;

const RecipeSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   category: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   instructions: {
      type: String,
      required: true
   },
   createdDate: {
      type: Date,
      default: Date.now
   },
   likes: {
      type: Number,
      default: 0
   },
   username: {
      type: String
   }
});

const RecipeModel = exports.RecipeModel = _mongoose2.default.model('Recipe', RecipeSchema);
//# sourceMappingURL=Recipe.js.map
