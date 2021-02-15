const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Note = require('../models/note')
const initialNotes = [
	{
		content: 'HTML is easy',
		date: new Date(),
		important: false,
	},
	{
		content: 'Browser can execute only Javascript',
		date: new Date(),
		important: true,
	},
]

beforeEach(async () => {
	await Note.deleteMany({})
	let oneObj = new Note(initialNotes[0])
	await oneObj.save()
	oneObj = new Note(initialNotes[1])
	await oneObj.save()
})

test('notes are returned as json', async () => {
	await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
	const response = await api.get('/api/notes')

	expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
	const response = await api.get('/api/notes')

	const contents = response.body.map(r => r.content)
	expect(contents).toContain('Browser can execute only Javascript')
})

test('a valid note can be added', async () => {
	const newNote = {
		content: 'async/await simplifies making async calls',
		important: true,
	}

	await api
		.post('/api/notes', newNote)
		.send(newNote)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/notes')
	const contents = response.body.map(r => r.content)

	expect(response.body).toHaveLength(initialNotes.length + 1)
	expect(contents).toContain(newNote.content)
})

test('a note without content will not be saved', async () => {
	const newNote = {
		important: true,
	}

	await api.post('/api/notes', newNote).send(newNote).expect(400)

	const response = await api.get('/api/notes')
	expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
	mongoose.connection.close()
})
