const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	)
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://erik:${password}@cluster101.4lp4q.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})

const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
	content: 'GET and POST are the most important methods of HTTP protocol',
	date: '2019-05-30T19:20:14.298Z',
	important: true,
})

note.save().then(result => {
	console.log('note saved!')
	mongoose.connection.close()
})
