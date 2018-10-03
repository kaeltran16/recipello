import {model, Schema} from 'mongoose';

const ArticleSchema = new Schema({
		title: {
				type: String,
				required: true
		},
		body: {
				type: String,
				required: true
		},
		picture: {
				type: String
		},
		claps: [
				{
						type: Schema.Types.ObjectId,
						ref: 'User'
				}
		],
		responses: [
				{
						user: {
								type: Schema.Types.ObjectId,
								ref: 'User'
						},
						text: String
				}
		],
		tags: [
				{name: String}
		]
});

const ArticleModel = model('Articles', ArticleSchema);

export default ArticleModel;
