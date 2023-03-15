const express = require('express');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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

	// bcrypt.hash(password, null, null, function(err, hash) {
	//     console.log(hash);
	// });

	database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]); // grabbing the last item in the array, the user we just created
})


// PROFILE ROUTE
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
})


// IMAGE ROUTE
app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
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