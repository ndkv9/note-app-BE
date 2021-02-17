const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
	const body = req.body

	const saltRound = 10
	const passwordHash = await bcrypt.hash(body.password, saltRound)

	const user = new User({ ...body, passwordHash: passwordHash })

	const savedUser = await user.save()
	res.json(savedUser)
})

module.exports = usersRouter
