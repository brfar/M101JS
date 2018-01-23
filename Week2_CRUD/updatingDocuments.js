db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $set: {
    poster: "http://ia.media-imdb.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg"
  }
})

// https://docs.mongodb.com/manual/reference/operator/update-field/

db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $set: { // Add all the stuff above to the "The Martian" document
    "awards": { 
      "wins": 8,
      "nominations": 14,
      "text": "Nominated for 3 Golden Globes. Another 8 wins & 14 nominations."
    }
  }
});

/*
 * Updates are used to correct errors and, over time, keep our data current. 
 * For movie data, much of what's there is static: directors, authors and the 
 * like. Other content such as reviews and ratings will need to be updated as 
 * users take action. We could use $set for this purpose, but that's an error 
 * prone approach. It's too easy to do the arithmetic incorrectly. Instead, we 
 * have a number of operators that support numeric updates of data: 
 * $min, $max, $inc, $mul. Let's look at an example using $inc to update reviews.
 */

db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $inc: {
    "tomato.reviews": 3, // Takes the value and add 3
    "tomato.userReviews": 25
  }
})

var reviewText1 = [
  "The Martian could have been a sad drama film, instead it was a ",
  "hilarious film with a little bit of drama added to it. The Martian is what ",
  "everybody wants from a space adventure. Ridley Scott can still make great ",
  "movies and this is one of his best."
].join()

db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $push: { // Add a new field (an array) that contain one review
    reviews: {
      rating: 4.5,
      date: ISODate("2016-01-12T09:00:00Z"),
      reviewer: "Spencer H.",
      text: reviewText1
    }
  }
})

var reviewText2 = [
  "i believe its ranked high due to its slogan 'Bring him Home' there is nothi",
  "ng in the movie, nothing at all ! Story telling for fiction story !"
].join()

var reviewText3 = [
  "This is a masterpiece. The ending is quite different from the book - the mo",
  "vie provides a resolution whilst a book doesn't."
].join()

var reviewText4 = [
  "There have been better movies made about space, and there are elements of t",
  "he film that are borderline amateur, such as weak dialogue, an uneven tone,",
  " and film cliches."
].join()

var reviewText5 = [
  "This novel-adaptation is humorous, intelligent and captivating in all its v",
  "isual-grandeur. The Martian highlights an impeccable Matt Damon, power-stac",
  "ked ensemble and Ridley Scott's masterful direction, which is back in full ",
  "form."
].join()

var reviewText6 = [
  "A declaration of love for the potato, science and the indestructible will t",
  "o survive. While it clearly is the Matt Damon show (and he is excellent), t",
  "he supporting cast may be among the strongest seen on film in the last 10 y",
  "ears. An engaging, exciting, funny and beautifully filmed adventure thrille",
  "r no one should miss."
].join()

var reviewText7 = [
  "The Martian could have been a sad drama film, instead it was a hilarious fi",
  "lm with a little bit of drama added to it. The Martian is what everybody wa",
  "nts from a space adventure. Ridley Scott can still make great movies and th",
  "is is one of his best."
].join()

db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $push: { // Push all the reviews below to the "reviews" field
    reviews: {
      $each: [{ /* this modifier says that we should push on each one of these documents 
        as an individual element of the reviews array. If we don't use $each the entire
        array that we specify in our call to push will be added as a single element in 
        the array so we would have an array that then had a single element that was
        itself an array it's not what we want. */
        rating: 0.5,
        date: ISODate("2016-01-12T07:00:00Z"),
        reviewer: "Yabo A.",
        text: reviewText2
      }, {
        rating: 5,
        date: ISODate("2016-01-12T09:00:00Z"),
        reviewer: "Kristina Z.",
        text: reviewText3
      }, {
        rating: 2.5,
        date: ISODate("2015-10-26T04:00:00Z"),
        reviewer: "Matthew Samuel",
        text: reviewText4
      }, {
        rating: 4.5,
        date: ISODate("2015-12-13T03:00:00Z"),
        reviewer: "Eugene B",
        text: reviewText5
      }, {
        rating: 4.5,
        date: ISODate("2015-10-22T00:00:00Z"),
        reviewer: "Jens S",
        text: reviewText6
      }, {
        rating: 4.5,
        date: ISODate("2016-01-12T09:00:00Z"),
        reviewer: "Spencer H.",
        text: reviewText7
      }
      ]
    }
  }
})


db.movieDetails.updateOne({
  title: "The Martian"
}, {
  $push: {
    reviews: {
      $each: [{
        rating: 0.5,
        date: ISODate("2016-01-13T07:00:00Z"),
        reviewer: "Shannon B.",
        text: "Enjoyed watching with my kids!"
      }],
      $position: 0, /* if I want to ensure that the value I'm pushing on 
      goes on the front of the array I need to use the "position" modifier */

      $slice: 5 /* the slice modifier for "push" has to be used with $each
      It says is go ahead and push on everything that's listed here in the
      value for dollar each but keep just five of the elements in the array.
      The rest that were there are eliminated as part of our push operation.  */
    }
  }
})


// Could do this, but it's probably the wrong semantics.
db.movieDetails.updateMany({
  rated: null /* find all documents that have a value for rated that is null and
  set rated to unrated  */
}, {
  $set: {
    rated: "UNRATED"
  }
})


// Better to do this.
db.movieDetails.updateMany({
  rated: null
}, {
  $unset: { /* The $unset operator will simply take all of the fields 
    that I've listed in the document that I specify as $unset value
    and will remove them from all the matching docs. */
    rated: "" /* This value doesn't really matter I just tend to use 
    an empty string. */
  }
})


var detail = {
  "title": "The Martian",
  "year": 2015,
  "rated": "PG-13",
  "released": ISODate("2015-10-02T04:00:00Z"),
  "runtime": 144,
  "countries": [
    "USA",
    "UK"
  ],
  "genres": [
    "Adventure",
    "Drama",
    "Sci-Fi"
  ],
  "director": "Ridley Scott",
  "writers": [
    "Drew Goddard",
    "Andy Weir"
  ],
  "actors": [
    "Matt Damon",
    "Jessica Chastain",
    "Kristen Wiig",
    "Jeff Daniels"
  ],
  "plot": "During a manned mission to Mars, Astronaut Mark Watney is presumed" +
  " dead after a fierce storm and left behind by his crew. But Watney has" +
  " survived and finds himself stranded and alone on the hostile planet." +
  " With only meager supplies, he must draw upon his ingenuity, wit and " +
  "spirit to subsist and find a way to signal to Earth that he is alive.",
  "poster": "http://ia.media-imdb.com/images/M/" +
  "MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg",
  "imdb": {
    "id": "tt3659388",
    "rating": 8.2,
    "votes": 187881
  },
  "tomato": {
    "meter": 93,
    "image": "certified",
    "rating": 7.9,
    "reviews": 280,
    "fresh": 261,
    "consensus": "Smart, thrilling, and surprisingly funny, The Martian offers" +
    " a faithful adaptation of the bestselling book that brings out the best " +
    "in leading man Matt Damon and director Ridley Scott.",
    "userMeter": 92,
    "userRating": 4.3,
    "userReviews": 104999
  },
  "metacritic": 80,
  "awards": {
    "wins": 8,
    "nominations": 14,
    "text": "Nominated for 3 Golden Globes. Another 8 wins & 14 nominations."
  },
  "type": "movie"
};

/* UPSERTS are operations for which if no document is found matching our filter, 
we insert a new document hence the term upsert. */

db.movieDetails.updateOne({
  "imdb.id": detail.imdb.id // Filter
}, {
  $set: detail
}, {
  upsert: true /* What this says is that if this filter doesn't match any
  documents in my collection, that means I haven't seen the document before. 
  So I want to go ahead and insert it. The effect here then of this update, 
  is that for those situations I will end up creating a new document in my 
  collection to represent this detailed data that I'm pulling in from another source.

  The basic idea of upsert is that you want to make some type of update to a document
  in your collection, but if that document doesn't happen to be there already, you want 
  to go ahead and create a new one using what would have been the net effect of the update 
  operation. And of course, if we're creating a new document, it may be necessary for MongoDB 
  to create an _id field which is what happened here. */
});


db.movies.replaceOne({
    "imdb": detail.imdb.id // Filter
  },
  detail);


db.reviews.insertMany([{
  rating: 2.5,
  date: ISODate("2015-10-26T04:00:00Z"),
  reviewer: "Matthew Samuel",
  text: "There have been better movies made about space, and there are" +
  " elements of the film that are borderline amateur, such as weak dialogue," +
  " an uneven tone, and film cliches."
}, {
  rating: 5,
  date: ISODate("2015-12-18T09:00:00Z"),
  reviewer: "Jarrad C",
  text: "The Martian Review: There are some movies you know going into" +
  " them that they're going to be great. The Martian was not only great but" +
  " exceeded all my expectations as well. A return to form from director " +
  "Ridley Scott (Alien, Blade Runner) who directed last year's abysmal " +
  "'Exodus: Gods and Kings (which I adeptly gave 1/5 because I was happy that" +
  " it ended), The Martian soars to the heights of a great space epic. " +
  "In fact the thing that I loved about the Martian more than Alfonso Curon's" +
  " 'Gravity' and Christopher Nolan's 'Interstellar' is its optimism." +
  " Botanist Mark Watney played by an incredible Matt Damon, plays his " +
  "character to a tee without depressing or alienating viewers. It is " +
  "through this lens that we see plausible science (well somewhat plausible)" +
  " succeed and the audience truly root for Mark Watney to be rescued by his" +
  " Ares III crew creating a palpitating suspense during the rescue launch." +
  " That aside the supporting cast is impeccable, literally every single" +
  " character feels important and is given enough screen-time to shine," +
  " from Jessica Chastain's Commander Lewis to Chitwetel Ejiofer's Vincent" +
  " Kapoor. Also to be highly commended is the diversity of this cast- where" +
  " every character is simply just equal- just the way it should be in every film."
}, {
  rating: 3,
  date: ISODate("2015-12-13T03:00:00Z"),
  reviewer: "hunterjt13",
  text: "An astronaut/botanist is stranded on Mars and must rely upon " +
  "ingenuity to survive. It's hard to divorce my opinions about this film " +
  "from my opinions of the book, for after the film I thought that they had" +
  " adapted the book but left out all the good parts. The cut that bleeds " +
  "most is the final chapter, which gives the whole story a philosophical" +
  " significance that is both poignant and naively inspiring. Nevertheless," +
  " what remains is a fine tale of how science, wit, perseverance, and " +
  "intelligence are greater weapons than anything else. Mark Watney's humor" +
  " survives in the film, even if the film strips him of his vulgarity, all" +
  " in the service of obtaining a PG-13 rating (really, we must reexamine " +
  "why one 'fuck' corrupts thirteen- to seventeen-year-olds so much more than " +
  "ten, twenty, or 100 'fucks'). Mark Watney's intelligence survives the film" +
  " version, even if the film's story presents him with fewer obstacles to " +
  "'science the shit out of,' all in the service of giving director Ridley " +
  "Scott the opportunity to show beautiful Martian sunsets in the time " +
  "allowed. That Mark Watney character is quite a survivor. Overall, " +
  "please watch the film - it's good and it's values are inspiring - but read the book too."
}, {
  rating: 4.5,
  date: ISODate("2015-12-13T03:00:00Z"),
  reviewer: "Eugene B",
  text: "This novel-adaptation is humorous, intelligent and captivating in" +
  " all its visual-grandeur. The Martian highlights an impeccable Matt Damon," +
  " power-stacked ensemble and Ridley Scott's masterful direction, which is back in full form."
}, {
  rating: 3.5,
  date: ISODate("2015-10-10T03:00:00Z"),
  reviewer: "Kevin M. W",
  text: "Personable sci-fi flick from Ridley Scott that updates the old " +
  "Robinson Crusoe stuck on a desert isle (and how he learns to survive) " +
  "trope. First off, make that a deserted planet. Mars. And the background " +
  "and the hope this film presents is grounded on is our quest to reach beyond" +
  " the limits of Earth's gravity (and so it loudly parades that we'll " +
  "overcome every adversity). Now there's science here but let's not get too" +
  " excited. The emphasis is interestingly on the personalities involved, " +
  "interestingly because while the characters are the primary focus of this " +
  "tale on one hand, on the other hand they are only the flimsiest of " +
  "constructs with zero time spent 'getting to know them'. We only watch while" +
  " they react to danger. Who they are or who they might be outside of these" +
  " situations, we never get to see. This momentary drawback weakens the film, " +
  "but only by a bit. Its worth a watch, Jessica Chastain and Jeff Daniels " +
  "leading a deep bench of secondary players."
}, {
  rating: 4.5,
  date: ISODate("2015-10-13T03:00:00Z"),
  reviewer: "Drake T",
  text: "Equal parts fun, smart and thrilling. The Martian is a survival " +
  "story that doesn't ramp up melodrama but instead chooses to humanize " +
  "Watney's struggle with entertaining laughs. A love letter from Ridley to " +
  "fans of the book, it's simply flawless in pacing, dialogue and " +
  "characterization. The only element missing is visual style, there's " +
  "nothing iconic to look at that'll let us recall the film in years to come." +
  " Still it's beautifully directed and perfectly acted, an exciting ride " +
  "through and through. Most definitely a piece of hard fiction that'll leave" +
  " a mark for 2015 rivaling the success of genre-similar 'Interstellar' of " +
  "2014 yet completely different in approach of tone."
}, {
  rating: 4.5,
  date: ISODate("2015-10-22T00:00:00Z"),
  reviewer: "Jens S",
  text: "A declaration of love for the potato, science and the indestructible" +
  " will to survive. While it clearly is the Matt Damon show (and he is " +
  "excellent), the supporting cast may be among the strongest seen on film " +
  "in the last 10 years. An engaging, exciting, funny and beautifully filmed " +
  "adventure thriller no one should miss."
}, {
  rating: 2.5,
  date: ISODate("2015-09-17T02:00:00Z"),
  reviewer: "FiLmCrAzY",
  text: "This movie has everything, excitement, drama, emotion, humour, " +
  "strong characters led by Damon but ultimately fails to capture my attention!"
}, {
  rating: 3.5,
  date: ISODate("2015-09-21T11:00:00Z"),
  reviewer: "Sanjay R",
  text: "I really like how this film relied more on story than on action " +
  "and special effects. Goddard manages to keep the screenplay interesting, " +
  "and sometimes funny, throughout the entire 2 hours and 14 minutes. One of " +
  "my pet peeves in movies, however, is an isolated man talking to himself " +
  "and explaining all of his actions as if he knows he is being watched by an" +
  " audience and is obligated to amuse them. I know that sounds a bit like " +
  "saying 'Hey Matt Damon, be less entertaining,' but what I am really saying" +
  " is that I wish the film's entertainment came from a more natural place. " +
  "Other than my personal bete noire, the film is very well directed, acted " +
  "and written. A broad range of moviegoers will enjoy it, I would recommend " +
  "it to anyone."
}, {
  rating: 3.5,
  date: ISODate("2015-10-15T11:00:00Z"),
  reviewer: "Emile T"
}, {
  rating: 3.5,
  date: ISODate("2015-10-14T11:00:00Z"),
  reviewer: "Carlos M",
  text: "With a great 3D that explores very well the red landscapes using " +
  "mostly a large depth of field, this smart science fiction also knows how " +
  "to use exposition in its favor and works so well due to its delightful " +
  "sense of humor and efficient moments of tension when it needs to be tense."
}, {
  rating: 4.5,
  date: ISODate("2015-10-11T03:00:00Z"),
  reviewer: "Adriel L",
  text: "Out-standing!"
}, {
  rating: 3.5,
  date: ISODate("2015-10-05T03:00:00Z"),
  reviewer: "Pierluigi P",
  text: "It doesn't take itself too seriously, which translates in an " +
  "intelligent, immersive and charming adventure of survival. Untouched by " +
  "sappiness and thoughtful in execution. A triumph for Mr. Scott."
}, {
  rating: 4,
  date: ISODate("2015-09-17T03:00:00Z"),
  reviewer: "Flutie A",
  text: "Shades of 'Cast Away' & 'Apollo 13'. Really enjoyed it!"
}, {
  rating: 4.5,
  date: ISODate("2015-10-01T03:00:00Z"),
  reviewer: "KJ P",
  text: "Director Ridley Scott has hit the point in his life where it is as " +
  "unpredictable as the weather, as to how good his films will be. I can " +
  "gladly say, 'The Martian' is not only his best film in a very long time, " +
  "but it is also one os 2015's best overall pictures. After presumed dead " +
  "and left on Mars by his crew, botanist Mark Watney must use his scientific" +
  " skills to savour/grow food to last him up to four years. Filled with " +
  "unexpected humour, this film is able to balance a light-hearted tone while" +
  " digging deep into the emotion when necessary. This film had me chuckling " +
  "quite a bit, and I give full credit to Drew Goddard d Andy Weir who penned " +
  "the script. This witty sic-fi rescue mission is also as intense as it needs" +
  " to be, ramping up to the conclusion. From the visuals to the directing, " +
  "from the writing to the cinematography, and from the acting to the " +
  "believability of this film, it really is one of the biggest achievements " +
  "of the year by far. I was enthralled from start to finish. Although I have " +
  "to fault the film for ending a bit too abruptly, I can forgive that for " +
  "being the only true thing to bother me. In the end, 'The Martian' is a " +
  "damn fine piece of filmmaking. Fantastic!"
}, {
  rating: 4,
  date: ISODate("2015-11-03T09:00:00Z"),
  reviewer: "Sheldon C",
  text: "THE MARTIAN is a success because it presents its sci-fi scenarios " +
  "with care and plausibility, it keeps the plot simple and moving, and it " +
  "anchors itself with a strong lead actor in a character who is both " +
  "relatable and charming, resulting in a film that is accordingly thrilling," +
  " visually dazzling, and surprisingly funny. Although the narrative itself " +
  "does not necessarily present anything new - we've seen this scenario " +
  "before - and the story is quite predictable, Ridley Scott's latest benefits" +
  " from both a strong script that keeps momentum flowing and an especially " +
  "nuanced performance by Damon; it carries a much different tone than other " +
  "recent space dramas and for that, it is justified and comes highly recommended."
}, {
  rating: 5,
  date: ISODate("2016-01-12T09:00:00Z"),
  reviewer: "Mike S",
  text: "At no point in time did I have any doubt this movie would end " +
  "positively. Humor, ingenuity, and a beautiful adventure sums this film up," +
  " thanks to Matt Damon's impressive performance. The man's willingness to " +
  "survive with overall optimism gets him home."
}, {
  rating: 0.5,
  date: ISODate("2016-01-12T07:00:00Z"),
  reviewer: "Yabo A.",
  text: "i believe its ranked high due to its slogan 'Bring him Home' there " +
  "is nothing in the movie, nothing at all ! Story telling for fiction story !"
}, {
  rating: 5,
  date: ISODate("2016-01-12T09:00:00Z"),
  reviewer: "Kristina Z.",
  text: "This is a masterpiece. The ending is quite different from the book " +
  "- the movie provides a resolution whilst a book doesn't."
}, {
  rating: 4.5,
  date: ISODate("2016-01-12T09:00:00Z"),
  reviewer: "Spencer H.",
  text: "The Martian could have been a sad drama film, instead it was a " +
  "hilarious film with a little bit of drama added to it. The Martian is " +
  "what everybody wants from a space adventure. Ridley Scott can still make " +
  "great movies and this is one of his best."
}])