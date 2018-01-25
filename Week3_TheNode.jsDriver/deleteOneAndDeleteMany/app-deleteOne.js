var {MongoClient} = require('mongodb');
var	assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  var query = {"permalink": {"$exists": true, "$ne": null}};
  var projection = {"permalink": 1, "updated_at": 1};

  var cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort({"permalink": 1});

  var numToRemove = 0;

  var previous = { "permalink": "", "updated_at": "" };
  cursor.forEach(
    doc => {
      if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
        console.log(doc.permalink);

        numToRemove = numToRemove + 1;

        var filter = {"_id": doc._id};

        db.collection('companies').deleteOne(filter, (err, res) => {
          assert.equal(err, null);
          console.log(res.result);
        });
      }

      previous = doc;
    },
    err => {
      assert.equal(err, null);
    }
  );
});

/* 👀 Running this code will throw an error 👀
Note that we're stipulating that we want to do a sort on line 13. In a later section when we talk about indexes, we will learn 
that we can actually do  sorting on the database side, so within MongoDB itself, provided we have set up an index that MongoDB 
can  use to do our sort.  So for example, one index in this  case would be an index on permalink.  We don't have such an index 
set up. So what's going to happen is, the system is going to try to do a sort in memory, rather than in the database. 
So as a little bit of foreshadowing, what I'd like to do here is just go into the Mongo shell and I'm going to create an index: 

> db.companies.createIndex({permalink: 1});

If I  execute the createIndex  command, then I will create an  index on the permalink  field on this  collection. And  this will 
enable MongoDB to be able to sort my query using this index merely by walking the keys in the index. This will solve the problem.
*/