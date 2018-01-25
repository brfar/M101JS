var {MongoClient} = require('mongodb');
var Twitter = require('twitter');
var assert = require('assert');

require('dotenv').load();
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

MongoClient.connect('mongodb://localhost:27017/social', (err, db) => {

  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  twitterClient.stream('statuses/filter', {track: "marvel"}, stream => {
    stream.on('data', status => {
      console.log(status.text);
      db.collection("statuses").insertOne(status, (err, res) => {
        console.log("Inserted document with _id: " + res.insertedId + "\n");
      });
    });

    stream.on('error', error => {
      throw error;
    });
  });

});