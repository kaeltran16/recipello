import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

const UserModel = mongoose.model('Recipe', UserSchema);

export default UserModel;
