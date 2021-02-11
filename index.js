require('dotenv').config()
const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()

const Note = require('./models/note')

const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// crate a new note
app.post('/api/notes', (req, res, next) => {
	const body = req.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note
		.save()
		.then(savedNote => savedNote.toJSON())
		.then(formattedNote => res.json(formattedNote))
		.catch(err => next(err))
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
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

app.listen(config.PORT, () =>
	logger.info(`server running on port ${config.PORT}`)
)
