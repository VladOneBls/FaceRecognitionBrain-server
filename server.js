const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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


// ** END POINTS: ** //

// ROOT ROUTE
app.get('/', (req, res) => { res.send('success') })
// SIGNIN ROUTE
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
// REGISTER ROUTE
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
// PROFILE ROUTE
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
// IMAGE ROUTE
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
// SERVER LISTENING
app.listen(3000, () => { console.log('app is running on port 3000') })