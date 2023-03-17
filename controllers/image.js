const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: 'e5f72d1333134e5fb68917f6a4876f94'
});

const handleApiCall = (req, res) => {
	app.models.predict('face-detection', req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}