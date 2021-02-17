const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: String,
	name: String,
	passwordHash: String,
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Note',
		},
	],
})

userSchema.set('toJSON', {
	transform: (doc, returnedObj) => {
		returnedObj.id = returnedObj._id.toString()
		delete returnedObj._id
		delete returnedObject.__v
		// passwordHash should not be revealed
		delete returnedObj.passwordHash
	},
})

module.exports = mongoose.model('User', userSchema)
