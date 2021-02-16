const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({})
	response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
	try {
		const noteToReturn = await Note.findById(request.params.id)
		if (noteToReturn) {
			response.json(noteToReturn)
		} else {
			response.status(404).end()
		}
	} catch (err) {
		next(err)
	}
})

notesRouter.post('/', async (request, response, next) => {
	const body = request.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})
	try {
		const savedNote = await note.save()
		response.json(savedNote)
	} catch (err) {
		next(err)
	}
})

notesRouter.delete('/:id', async (request, response, next) => {
	try {
		await Note.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} catch (err) {
		next(err)
	}
})

notesRouter.put('/:id', (request, response, next) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))
})

module.exports = notesRouter
