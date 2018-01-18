db.movieDetails
	.find({
		$or: [{ 'tomato.meter': { $gt: 99 } }, { metacritic: { $gt: 95 } }]
		// Return movies with a tomato.meter greater than 99 OR metacritic greater than 95.
	})
	.pretty();

db.movieDetails
	.find({
		$and: [{ metacritic: { $ne: null } }, { metacritic: { $exists: true } }]
		// Return movies where the metacritic field is NOT equal to null AND where it exists..
	})
	.pretty();
