var { MongoClient } = require('mongodb');
var assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
	assert.equal(err, null);
	console.log('Successfully connected to MongoDB.');

	var query = { category_code: 'biotech' };
	var projection = { name: 1, category_code: 1, _id: 0 };

	var cursor = db.collection('companies').find(query).project(projection);

	cursor.forEach(
		doc => {
			console.log(doc.name + ' is a ' + doc.category_code + ' company.');
			console.log(doc);
		},
		err => {
			assert.equal(err, null);
			return db.close();
		}
	);
});
