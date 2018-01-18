db.movieDetails
	.find({
		runtime: {
			$gt: 90 // Return the number of movies with a runtime greater than 90
		}
	})
	.count(); // Change to .pretty() if you wanna see that movies instead.

db.movieDetails
	.find(
		{
			runtime: {
				$gt: 90, // Find movies with a runtime greater than 90
				$lt: 120 // AND less than 120.
			}
		},
		{
			title: 1, // Show the title..
			runtime: 1, // Show runtime
			_id: 0 // Hide _id
		}
	)
	.count();

db.movieDetails.find(
	{
		'tomato.meter': {
			$gte: 95 // Find movies with a tomato meter greater or equal than 95
		},
		runtime: {
			$gt: 180 // AND runtime greater than 180.
		}
	},
	{
		title: 1, // Show the title
		runtime: 1, // Show runtime
		_id: 0 // Hide _id
	}
);

db.movieDetails
	.find({
		rated: {
			$ne: 'UNRATED' // Find movies not equal to UNRATED.
		}
	})
	.count();

db.movieDetails
	.find({
		rated: {
			$in: ['G', 'PG'] // Return all documents where the value of rated is "G" OR "PG"
		}
	})
	.pretty();
