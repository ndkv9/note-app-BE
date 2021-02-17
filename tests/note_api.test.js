const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
	await Note.deleteMany({})

	for (let note of helper.initialNotes) {
		let noteObj = new Note(note)
		await noteObj.save()
	}
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

	const notesAtEnd = await helper.notesInDB()
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

	const notesAtEnd = await helper.notesInDB()
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
	const noteAtStart = await helper.notesInDB()
	const noteToView = noteAtStart[0]

	const resultNote = await api
		.get(`/api/notes/${noteToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const processedNote = JSON.parse(JSON.stringify(noteToView))

	expect(resultNote.body).toEqual(processedNote)
})

test('a note can be deleted', async () => {
	const noteAtStart = await helper.notesInDB()
	const noteToDel = noteAtStart[0]

	await api.delete(`/api/notes/${noteToDel.id}`).expect(204)

	const noteAtEnd = await helper.notesInDB()
	expect(noteAtEnd).toHaveLength(noteAtStart.length - 1)

	const contents = noteAtEnd.map(n => n.content)
	expect(contents).not.toContain(noteToDel.content)
})

describe('when there is only one user in DB', () => {
	beforeEach(async () => {
		User.deleteMany({})

		const passwordHash = await bcrypt.hash('secret', 10)
		const user = new User({ username: 'saiyan1', passwordHash })

		await user.save()
	})

	test('creating succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDB()

		const newUser = {
			username: 'namek1',
			name: 'piccolo',
			password: 'password2',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDB()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creating new user fails if username already exists', async () => {
		const usersAtStart = await helper.usersInDB()

		const newUser = {
			username: 'saiyan1',
			name: 'gohan',
			password: 'gokuson',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDB()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

		expect(result.body.error).toContain('`username` to be unique')
	})
})

afterAll(() => {
	mongoose.connection.close()
})
