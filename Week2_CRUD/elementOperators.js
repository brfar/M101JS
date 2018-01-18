db.movieDetails.find({
	'tomato.meter': {
		$exists: true // Return only the documents where the 'tomato.meter' DOES exist..
	}
});

db.movieDetails.find({
	'tomato.meter': {
		$exists: false // Return documents where the 'tomato.meter' field DOES NOT exist.
	}
});

// Value of $type may be either a BSON type number or the string alias
// See https://docs.mongodb.org/manual/reference/operator/query/type
db.moviesScratch.find({
	_id: {
		$type: 'string' // Return documents where the _id field is a string, instead of the ObjectId default
	}
});
