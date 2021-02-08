const express = require('express')
const app = express()

const Note = require('./model/note')

const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing',
		})
	}

	note = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generateId(),
	}

	notes = notes.concat(note)

	res.json(note)
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => res.json(notes))
})

app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id
	const note = notes.find(note => String(note.id) === id)
	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
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
