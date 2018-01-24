### `find` and Cursors in the Node.js driver

To import a database into MongoDB, on the terminal, exactly where the file is, run `mongoimport -d crunchbase -c companies companies.json`.

This program is an example of using `find` the Node.js driver.
```javascript
const { MongoClient } = require('mongodb');
const assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
  assert.equal(err, null);
  console.log('Successfully connected to MongoDB.');

  const query = { "category_code": "biotech" };

  db
    .collection('companies')
    .find(query)
    .toArray((err, docs) => {
      assert.equal(err, null);
      assert.notEqual(docs.length, 0);

      docs.forEach(doc => console.log(`${doc.name} is a ${doc.category_code} company.`));

      db.close();
    });
});
```
`find` returns a cursor, so we're calling `toArray` on that cursor. `toArray` returns an array with all the docs, then we're using `forEach` to loop through the docs and printing each document. The first assertion is to make sure there's no error, and the second one is to make sure the length of the array is not 0.

```javascript
const { MongoClient } = require('mongodb');
const assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
  assert.equal(err, null);
  console.log('Successfully connected to MongoDB.');

  const query = { "category_code": "biotech" };

  var cursor = db.collection('companies').find(query);

  cursor.forEach(doc => {
      console.log(`${doc.name} is a ${doc.category_code} company.`);
    },
    err => {
      assert.equal(err, null);
      return db.close();
    }
  );
});
```

This is a slightly different version of the first code. Note that we have a call to the `find` method, but don't give it a callback. Remember that `find` returns a cursor and we're assigning the value returned from `find` (the cursor) to a variable called `cursor`.

Chaining a call to `toArray` onto a call to `find` (as we did in the first example) consumes the cursor and gives us an array of documents we can work with. With code written like the second example, instead of consuming everything at once and pulling it all in to memory, we're streaming the data to our application. `find` can create the cursor immediately because it doesn't actually make a request to the database until we try to use some of the documents it will provide. The point of the cursor is just to describe our query.
In the first example, it was `toArray` that provided the need to actually retrieve documents from the database. When we did that `toArray` call, the driver said "okay the client app is actually looking for all the documents and wants them back in an array so I'll actually have to go execute the query". In this second example we haven't actually asked for anything yet, so it can just make the cursor object and return it.  Cursor objects provide a `forEach` method. Note that this is not the `forEach` method on arrays because we're dealing with the cursor here as opposed to an array object. And the form of this method, that is to say what arguments it expects are different. The cursor `forEach` method expects as its first argument a callback for iterating through the documents; it will call this callback one time for each document in the result set. The second argument is what to do when the cursor is exhausted or in the case of an error. When we call `forEach` here as, with `toArray` this is an indication to the driver that needs to actually go get us some documents. 
The difference between the 2 examples is that with the code written this way we're streaming the documents into the application as we need them. And all we're really doing here is printing them out one at a time. 

When the cursor requests documents from MongoDB triggered by something like the cursor method `toArray` or the cursor method `forEach`, the response from the database system isn't necessarily the entire result set. So consider a situation where you have a massive database with many many documents and you don't actually want to return the whole set of documents all at once; what actually happens is that when the cursor has to go off and get some documents, say because we called `forEach`, MongoDB will return a batch of documents up to a certain batch size. So in the second example when the cursor gets back that  first batch of results it can actually start passing documents to the callback we've handed `forEach`. Once that initial batch runs out, the cursor can make another request to get the next batch and once that batch runs out, can make another request and so on until it reaches the end of the result set. This works very nicely with a method  like `forEach` because we can process documents as they come in in successive batches. Contrast this was `toArray` where the callback doesn't get called until all documents have been retrieved from the database system and the entire array is built, which means you're not getting any advantage from  the fact that the driver and database system are working together to batch results to your application. Batching is meant to provide some efficiency in terms of memory overhead an execution time so take advantage of it, if you can, in your applications.

___

### Projection in the Node.js Driver

```javascript
var { MongoClient } = require('mongodb');
var assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
  assert.equal(err, null);
  console.log('Successfully connected to MongoDB.');

  var query = { "category_code": "biotech" };
  var projection = { "name": 1, "category_code": 1, "_id": 0 };

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

```

The idea behind field projection is that in some circumstances we only care about some of the fields in the documents returned.
`query` is gonna form the "companies" collection, only documents which "category_code" equals "biotech"
We've added added a `projection` object so that the only fields we get back from our query are those we need for the message we are
printing below. In a real application, you would project out just the fields you needed for whatever web page you need to display: an analytics task that you need to run or some other job your application is designed to accomplish.
Projection allows us to explicitly include or exclude fields. We use 1 to indicate that we want to include a field and 0 to exclude fields.  Remember that _id is special in that it is always included unless we explicitly exclude it.
`cursor` is chaining some methods on `db`: `collection` specifies which database collection we're pulling data from. `find` specifies what exactly we're looking for, and `projection` specifies which fields from the query we wanna show.
The call to `find` will be synchronous. It won't actually go and fetch documents from the database. Rather, it'll simply immediately return a
cursor to us. We're going to modify that cursor with a field projection, using the `project` method on cursors and then we're going to call `forEach` on the cursor, passing 2 callbacks: one to iterate though the returned documents, and another callback to be called if there's an error or when we've exhausted the cursor.

🔥 What's important to realize is that there is a performance advantage, in that we're only sending over the wire and using network bandwidth for data that we actually need. This is a factor that can have a sizeable performance impact especially when there are thousands of clients making requests to our database. By projecting out just the fields we need, responses will require less time to assemble on the database side, less time to transmit to clients, and less time to process within those clients 🔥

___

### Query Operators in the Node.js Driver

Check /queryOperatorsInNodeJSDriver/

___

### to
