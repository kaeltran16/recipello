import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
		name: {
				type: String,
				required: true
		},
		email: {
				type: String,
				required: true
		},
		password: {
				type: String,
				required: true
		},
		avatar: {
				type: String
		},
		followers: [
				{
						type: Schema.Types.ObjectId,
						ref: 'User'
				}
		],
		followings: [
				{
						type: Schema.Types.ObjectId,
						ref: 'User'
				}
		],
		bookMarks: [{
				type: Schema.Types.ObjectId,
				ref: 'Article'
		}],
		interests: [
				{name: String}
		],
		notifications: [{
				user: {
						type: Schema.Types.ObjectId,
						ref: 'User'
				},
				message: String,
				isRead: {
						type: Boolean,
						default: false
				}
		}]
});

const UserModel = mongoose.model('Users', UserSchema);

export default UserModel;

