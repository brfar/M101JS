/* Here we're handling the _id ourselves. On lines 6 and 18 the _id is repeated. If we run this, only two objects will be added
to the database. By default insertMany does and ordered insert so it'll add the first and second object, when it sees the repeated
_id on the third object, it'll stop inserting and throw an error. 
If we want the app to keep going if it encounters an error, we should add a second argument to insertMany as shown on line 40.
This command make sure MongoDB keep inserting the rest of the documents even if it encounters an error..
*/

db.moviesScratch.insertMany(
  [
    {
      _id: 'tt0084726', // Repeated.
      title: 'Star Trek II: The Wrath of Khan',
      year: 1982,
      type: 'movie'
    },
    {
      _id: 'tt0796366',
      title: 'Star Trek',
      year: 2009,
      type: 'movie'
    },
    {
      _id: 'tt0084726', // Repeated.
      title: 'Star Trek II: The Wrath of Khan',
      year: 1982,
      type: 'movie'
    },
    {
      _id: 'tt1408101',
      title: 'Star Trek Into Darkness',
      year: 2013,
      type: 'movie'
    },
    {
      _id: 'tt0117731',
      title: 'Star Trek: First Contact',
      year: 1996,
      type: 'movie'
    }
  ],
  {
    ordered: false
  }
);
