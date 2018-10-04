import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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
				default: Date.now()
		},
		likes: {
				type: Number,
				default: 0
		},
		username: {
				type: String
		}
});

export const RecipeModel = mongoose.model('Recipe', RecipeSchema);

