db.movieDetails
	.find({
		genres: {
			$all: ['Comedy', 'Crime', 'Drama'] // Return movies which genres include Comedy AND Crime AND Drama
		}
	})
	.pretty();

////////////////////////////////////////

db.movieDetails
	.find({
		countries: {
			$size: 1 // Return movies which the array 'countries' only has one element
		}
	})
	.pretty();

////////////////////////////////////////

boxOffice: [
	{ country: 'USA', revenue: 41.3 },
	{ country: 'Australia', revenue: 2.9 },
	{ country: 'UK', revenue: 10.1 },
	{ country: 'Germany', revenue: 4.3 },
	{ country: 'France', revenue: 3.5 }
];

db.movieDetails.find({
	'boxOffice.country': 'UK', // Would return movies from country UK
	'boxOffice.revenue': {     // AND movies with revenue greater than 15. Not what we want.
		$gt: 15
	}
});

db.movieDetails.find({
	boxOffice: {
		$elemMatch: {
			country: 'UK', // Return movies from the UK in which the revenue is greater than 15!
			revenue: { $gt: 15 }
		}
	}
});
