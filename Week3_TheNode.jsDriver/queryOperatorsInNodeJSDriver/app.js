/** This is a program that works on the command line. It takes command line parameters and query MongoDB differently, depending
 * on what we've specified. If we run > app.js it'll print out a Usage message telling we need to provide firstYear and lastYear.
 * 
 */

var { MongoClient } = require('mongodb');
var commandLineArgs = require('command-line-args'); // https://www.npmjs.com/package/command-line-args
var assert = require('assert'); // Make assertions

var options = commandLineOptions();
/** options is here, before connecting to MongoDB because we need to make sure the user is passing the arguments, that's what
 * commandLineOptions do: it return the options that's gonna be passed to MongoDB. It also gives the message that the user
 * need to pass some values. What's returned from this function is gonna be stores in the options variable and is gonna be passed
 * to MongoDB below.
 */

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {
  assert.equal(err, null);
  console.log("Successfully connected to MongoDB.");

  var query = queryDocument(options);
  var projection = {
    "_id": 1,
    "name": 1,
    "founded_year": 1,
    "number_of_employees": 1,
    "crunchbase_url": 1
  };

  var cursor = db.collection("companies").find(query, projection);
  var numMatches = 0; // Counter

  cursor.forEach(
    doc => {
      numMatches += 1;
      console.log(doc);
    },
    err => {
      assert.equal(err, null);
      console.log("Our query was:" + JSON.stringify(query));
      console.log("Matching documents: " + numMatches);
      return db.close(); // Close the database and exit the program
    }
  );
});

function queryDocument(options) { // "options" is what we've typed on the command line
  console.log(options);

  var query = {
    "founded_year": { // Das a property on the objects in the database
      "$gte": options.firstYear, // Years greater/equal 
      "$lte": options.lastYear // Years less/equal
    },
    /**
     * The "if" below could've been included here as:
     * "number_of_employees" : options.employees
     * It's just a different syntax.
     */
  };

  if ("employees" in options) query.number_of_employees = { $gte: options.employees };

  return query;
}

function commandLineOptions() {
  var cli = commandLineArgs([
    { name: "firstYear", alias: "f", type: Number },
    { name: "lastYear", alias: "l", type: Number },
    { name: "employees", alias: "e", type: Number }
  ]);

  /** The variable "cli" is a constructor and it creates a cli object with a "parse" method. 
   * That parse method then will parse everything that we've typed in on the command line. We're 
   * storing that returned object on the 'options' variable below: */
  var options = cli.parse();
  if (!("firstYear" in options && "lastYear" in options)) { // If the user didn't type firstYear AND lastYear:
    console.log(cli.getUsage({
        title: "Usage",
        description:
          "The first two options below are required. The rest are optional."
    }));
    process.exit();
  }

  return options;
}
