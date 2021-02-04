const express = require('express')
const app = express()

app.use(express.json())

// hardcode data
let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2019-05-30T17:30:31.098Z',
		important: true,
	},
	{
		id: 2,
		content: 'Browser can execute only Javascript',
		date: '2019-05-30T18:39:34.091Z',
		important: false,
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2019-05-30T19:20:14.298Z',
		important: true,
	},
]

app.post('/api/notes', (req, res) => {
	const newNote = req.body
	notes = notes.concat(newNote)

	res.json(newNote)
})

app.get('/', (req, res) => {
	res.send('<h3>hello darkness</h3>')
})

app.get('/api/notes', (req, res) => {
	res.json(notes)
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

const PORT = 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
