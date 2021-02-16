const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
	await Note.deleteMany({})
	let oneObj = new Note(helper.initialNotes[0])
	await oneObj.save()
	oneObj = new Note(helper.initialNotes[1])
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

	expect(response.body).toHaveLength(helper.initialNotes.length)
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
		.post('/api/notes')
		.send(newNote)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const notesAtEnd = await helper.notesInDb()
	const contents = notesAtEnd.map(n => n.content)

	expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
	expect(contents).toContain(newNote.content)
})

test('a note without content will not be saved', async () => {
	const newNote = {
		important: true,
		date: new Date(),
	}

	await api.post('/api/notes').send(newNote).expect(400)

	const notesAtEnd = await helper.notesInDb()
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
	const noteAtStart = await helper.notesInDb()
	const noteToView = noteAtStart[0]

	const resultNote = await api
		.get(`/api/notes/${noteToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const processedNote = JSON.parse(JSON.stringify(noteToView))

	expect(resultNote.body).toEqual(processedNote)
})

test('a note can be deleted', async () => {
	const noteAtStart = await helper.notesInDb()
	const noteToDel = noteAtStart[0]

	await api.delete(`/api/notes/${noteToDel.id}`).expect(204)

	const noteAtEnd = await helper.notesInDb()
	expect(noteAtEnd).toHaveLength(noteAtStart.length - 1)

	const contents = noteAtEnd.map(n => n.content)
	expect(contents).not.toContain(noteToDel.content)
})

afterAll(() => {
	mongoose.connection.close()
})
