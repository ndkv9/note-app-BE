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
app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => res.json(notes))
})

// retrieve a single note
app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id
	Note.findById(id).then(returnedNote => res.json(returnedNote))
})

app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter(note => note.id !== id)

	res.status(204).end()
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
