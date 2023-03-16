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

// Creating a variable instead of using a database for now
const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date() // creates a date when the line is executed
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	],
	// login: [
	// 	{
	// 		id: '987',
	// 		hash: '',
	// 		email: 'john@gmail.com'
	// 	}
	// ]
}

app.use(cors());


// ROOT ROUTE
app.get('/', (req, res) => {
	// res.send('this is working');
	res.send(database.users);
})


// SIGNIN ROUTE
app.post('/signin', (req, res) => {
	// bcrypt.compare("apple", '$2a$10$5eXiUaZFTFfL4RddmZDUaOCER2Ax4rrpu1XNXLdIiJ5SkiEu/Mgeu', function(err, res) {
	//     console.log('first guess', res)
	// });
	// bcrypt.compare("veggies", '$2a$10$5eXiUaZFTFfL4RddmZDUaOCER2Ax4rrpu1XNXLdIiJ5SkiEu/Mgeu', function(err, res) {
	//     console.log('second guess', res)
	// });

	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})


// REGISTER ROUTE
// Always send any sensitive info from front-end to back-end using https in a POST req/body.

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


// STORING PASSWORDS SECURELY
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


// SERVER LISTENING
app.listen(3000, () => {
	console.log('app is running on port 3000');
})


/*
// *** PLAN *** //
// END POINTS:

/ --> res = this is working
/signin --> POST = success/fail (respond with success/fail)
/register --> POST = user (return user obj)
/profile/:userId --> GET = user (return user)
/image --> PUT = user (return updated user obj)

*/


// In Terminal, run 'npm install bcrypt-nodejs' to install bcrypt for storing the passwords securely