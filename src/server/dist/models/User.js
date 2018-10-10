'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.UserModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

const UserSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   joinDate: {
      type: Date,
      default: Date.now()
   },
   favorites: {
      type: [Schema.Types.ObjectId],
      ref: 'Recipe'
   }
});

UserSchema.pre('save', function (next) {
   if (!this.isModified('password')) {
      return next;
   }

   _bcryptjs2.default.genSalt(10, (err, salt) => {
      if (err) return next(err);

      _bcryptjs2.default.hash(this.password, salt, (err, hash) => {
         if (err) return next(err);
         this.password = hash;
         next();
      });
   });
});

const UserModel = exports.UserModel = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map