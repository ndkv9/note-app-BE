require('dotenv').config()
const express = require('express')
const app = express()

const Note = require('./models/note')

const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// crate a new note
app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing',
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note.save().then(savedNote => res.json(savedNote))
})

// retrieve all notes
app.get('/api/notes', (req, res, next) => {
	Note.find({})
		.then(notes => res.json(notes))
		.catch(err => next(err))
})

// retrieve a single note
app.get('/api/notes/:id', (req, res, next) => {
	const id = req.params.id
	Note.findById(id)
		.then(returnedNote => {
			if (returnedNote) {
				res.json(returnedNote)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

// delete a single note by id
app.delete('/api/notes/:id', (req, res, next) => {
	const id = req.params.id
	Note.findByIdAndRemove(id)
		.then(result => res.status(204).end())
		.catch(err => next(err))
})

// toggle the important of a note
app.put('/api/notes/:id', (req, res, next) => {
	const body = req.body
	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote)
		})
		.catch(err => next(err))
})
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		res.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
