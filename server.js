const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

// Connecting to the database 'FaceRecognitionBrainDB'
const db = knex({
	client: 'pg',
  	connection: {
  		host : '127.0.0.1', // same as localhost
  		user : 'vladone',
  		port: 5432,
  		password : '',
  		database : 'FaceRecognitionBrainDB'
  	}
});

const app = express();
app.use(express.json());
app.use(cors());


// ROOT ROUTE
app.get('/', (req, res) => {
	res.send('success');
})


// SIGNIN ROUTE
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
})


// REGISTER ROUTE
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
})


// PROFILE ROUTE
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting user'))
})


// IMAGE ROUTE
app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('unable to get entries'))
})


// SERVER LISTENING
app.listen(3000, () => {
	console.log('app is running on port 3000');
})