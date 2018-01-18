## Creating Documents

For creating documents we have `insertOne()` and `insertMany()` and. These are the two principal commands for creating documents in MongoDB. 

### The `_id` field

MongoDB, if we don't supply one, creates an `_id` field by
default. All collections have a unique primary index on the `_id` field. 

```
ObjectId: 5a5e8beeaef0acf887b0f369
          └──────┘└────┘└──┘└────┘
          Date    MAC   PID Counter
          12-byte Hex String
```
**Date**: 4 bytes representing the seconds since the UNIX epoch; a timestamp.

**Mac**: 3 bytes representing a machine identifier. They are the MAC address for the machine on which the
MongoDB server is running.

**PID**: 2 bytes representing the ProcessID

**Counter**: 3 bytes representing a counter to ensure that
all ObjectIDs are unique even if a couple of writes happen under a set of conditions such that the first nine bytes would end up being the same as a second right.

## Reading Documents

```javascript
> db.movieDetails.find({ rated: "PG-13" }).pretty()
```
In this example, we're querying on a single field and specifying that we want to see only documents rated PG-13.
 > Use `.count()` to see the number of documents matching the query
 
We can restrict the results set further by adding additional selectors to our query document:

```javascript
> db.movieDetails.find({ rated: "PG-13", year: 2009 }).count()
```
In the MongoDB query language we refer to the first argument
to `find` as a query document.
The fields in this document are selectors that restrict the result set to only those matching these criteria. What's important to notice is that selectors in the query document for find are implicitly anded together meaning that **only documents matching both of these criteria are
retrieved**.

```javascript
> db.movieDetails.find({ "tomato.meter": 100 }).pretty()
```
We're using what we call "dot notation" in order to identify a field of a document nested within the field `tomato` on `toyStory3.js`.

The dot notation syntax works for documents nested at any level. **You must enclose the key in quotes**. As you may be aware it's not strictly necessary to use quotes in some clients. The shell is actually one example. So
while on the `rated: "PG-13"` example I can leave the quotes around the key, but on the `"tomato.meter": 100` example, I cannot do this.

```javascript
> db.movieDetails.find({ "writers": ["Ethan Coen", "Joel Coen"] }).count()
```

In this example, our search is going to identify documents by an exact match to an array of one or more values. For these types of queries, the order of elements matter. Meaning that I will only match documents that have Ethan Coen followed by Joel Coen.

It's more common that we match documents for which a single element of the array matches selectors in our query:

```javascript
> db.movieDetails.find({ "actors": "Jeff Bridges" }).pretty()
```
The semantics of this query are that document matches will be those that contain the string Jeff Bridges as one element of the array actors.

The MongoDB query language enables us to specify that we want to match array elements occurring in a specific position in an array:

```javascript
> db.movieDetails.find({ "actors.0": "Jeff Bridges" }).pretty()
```

This will return all the documents in which Jeff Bridges is the first one (index 0) on the actors array.

### Cursors

The find method returns a cursor. To access documents you
need to iterate through the cursor. In the Mongo shell if we don't assign the return value from "find" to a variable using the "var" keyword, the cursor is automatically iterated up to 20 times to
print an initial set of search results.

in general the MongoDB server returns the query results in batches. Batch size will not exceed the maximum BSON document size, and for most queries the first batch returns 101 documents or just enough documents to exceed 1MB. Subsequent batches will be 4MB. 

As we iterate through the cursor and reach the end of the return batch, if there are more results, `cursor.next()` will perform a
get more operation to retrieve the next batch. Since these documents are relatively small, our initial batch is gonna be 101 documents so by typing `it` repeatedly at the cursor we've just
iterated through two batches - the first one with 101 documents and then a second one composed of just seven documents. If you want to see how many documents remain in a batch as you iterate through
the cursor or just in general look more closely at how cursors work in the shell, you can use something like the following:

1. First we'll assign our cursor to a variable using the var keyword

```javascript
> var c = db.movieDetails.find();
```
2. Next, we'll create a function that uses this cursor checking first to see whether there are any more results, and if there are, getting the next one, otherwise returning `null`.

```javascript
> var doc = function() { return c.hasNext() ? c.next() : null; }
```

Before we do anything, we can check to see how many objects are
in our batch by using this method on our cursor object:

```javascript
> c.objsLeftInBatch();
```

I can iterate through the batch by calling just the `doc()` function that we setup, and then we can call `c.objsLeftInBatch();`
again to see how many documents are left in our batch.

[Docs link for more on cursors](https://docs.mongodb.com/manual/reference/method/js-cursor/index.html)

### Projection

Projection is a handy way of reducing the size of the data returned
for any one query. As we know by default, MongoDB returns all fields in all matching documents for queries. To limit the amount of data that MongoDB sends to your application, you can include
projections in your queries. Projections reduce network overhead and processing requirements by limiting the fields that are returned in results documents. Projections are supplied as the second argument to the "find" command. If I want to limit my documents so that they just contain a title, I can do that using
this, or almost:

```javascript
> db.movieDetails.find({ rated: "PG" }, { title: 1 }).pretty()
``` 

This will return all the "PG" movies but will only show the title **and** the _id field. The projection syntax allows me to explicitly include fields in documents returned. I can also
explicitly exclude fields. If I explicitly include fields, those are the only fields that will be returned. The one exception is _id - it will always be returned by default. If I don't want to see
_id in return documents, I need to explicitly exclude it and I can do that by simply specifying a 0 for "id" in my projection document:

```javascript
> db.movieDetails.find({ rated: "PG" }, { title: 1, _id: 0 }).pretty()
``` 

### Comparison Operators

Check `comparisonOperators.js` for code with comments. More on the [docs](https://docs.mongodb.com/manual/reference/operator/query/).

## Updating Documents

MongoDB provides three different update commands: they are `updateOne`, `updateMany` and `replaceOne`

```javascript
db.movieDetails.updateOne({ title: "The Martian"}, { $set: { poster: "http://ia.media-imdb.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg" }});
```

The first argument on `updateOne` is a filter (or selector) document. Here it's `{ title: "The Martian" }`. This will identify the document we want to update. The way `updateOne` works is it will simply update the first document matching our selectors. In an application we'd be using a unique identifier such as the _id.

The second argument to `updateOne` is where we specify how we would like to update the document. You must apply an update operator of some kind. In this case we're using the `$set` operator. This operator takes a document as an argument, and it's expecting a document that has a number of fields specified. What it will do is update the document matching the filter such that all key value pairs are reflected in the new version of the document that's created. In this case we're going to add a "poster" field and supply this URL as the value for that field. If there was an existing poster field this would modify its value to the URL specified.