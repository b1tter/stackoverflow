const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongodb = require("mongodb");
let ObjectId = mongodb.ObjectId;

//deploy
import dotenv from 'dotenv';
require('dotenv').config();
//

let db;

// const shortcuts
const Posts_Collection = 'posts';
const dbName = "stackoverflowdb";
const Comments_Collection = 'comments';


//connect to mongodb
mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function (err, client) {
if (err) {
  console.log(err);
  process.exit(1);
}

db = client.db();
console.log("Database connection ready");
});

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan("combined")); // Log all requests to the console
app.use(express.static("../dist/mandatory_exercise"));


// Additional headers for the response to avoid trigger CORS security
// errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// posts
app.get("/api/post", function (req, res) {
  db.collection(Posts_Collection)
    .find({})
    .toArray(function (err, docs) {
    if (err) {
      onHandleError(res, err.message, 'Failed to get the posts')
    } else {
      res.status(200).json(docs);
    }
  })
  }
);

app.post("/api/post", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let post = {
    title: title,
    description: description
  };
  db.collection(Posts_Collection).insertOne(post, function (err, docs) {
    if (err) {
      onHandleError(res, err.message, 'Failed to create a new post')
    } else {
      res.status(200).json(docs)
    }
  })
});


app.get('/api/post/:id', function (req, res) {
  db.collection(Posts_Collection).findOne({_id: new ObjectId(req.params.id)}, function (err, docs) {
    if (err) {
      onHandleError(res, err.message, 'Failed to get the post');
    } else {
      res.status(200).json(docs)
    }
  })
});

app.get("/api/comment", (req, res) => {
  const { postId } = req.query;
  db.collection(Comments_Collection)
    .find({postId}) // aici ar trebui sa filter comments for each post
    .toArray(function(err, comm) {
      if (err) {
        onHandleError(res, err.message, "Failed to get comments.");
      } else {
        res.status(200).json(comm);
      }
    })
});

app.post("/api/comment", (req, res) => {
  let postId = req.body.postId;
  let owner = req.body.owner;
  let answer = req.body.answer;
  let comment = {
    postId: postId,
    owner: owner,
    answer: answer
  };
  db.collection(Comments_Collection).insertOne(comment, function (err, coms) {
    if (err) {
      onHandleError(res, err.message, 'Failed to create a comment')
    } else {
      res.status(200).json(coms)
    }
  })
});

app.get("/api/comment/:id", (req, res) => {
  const comment = findCommentById(req.params.id);
  // TODO: If comment is null, you should throw 404
  res.json(comment);
});

//votes
app.post("/api/comment/:id/vote", (req, res) => {
  const index = findCommentIdxById(req.params.id);
  const isUp = req.body.up;
  if (index !== -1) {
    const comment = comments[index];
    const vote = comment.vote;
    comments.splice(index, 1, {
      ...comment,
      vote: {
        ...vote,
        count: vote.count + 1,
        score: isUp ? vote.score + 5 : vote.score - 5
      }
    });
    res.json(vote);
  }
});

function findPostIdxById(id) {
  return posts.findIndex(post => post.id === id);
}

function findPostById(id) {
  const index = findPostIdxById(id);
  if (index !== -1) {
    return posts[index];
  }
  return null;
}

function findCommentIdxById(id) {
  return comments.findIndex(comment => comment.id === id);
}

function findCommentById(id) {
  const index = findCommentIdxById(id);
  if (index !== -1) {
    return comments[index];
  }
  return null;
}

// // MongoDB functions
// function connect() {
//   return new Promise((resolve, reject) => {
//     mongoClient
//       .connect(
//         dbUrl,
//         { useNewUrlParser: true }
//       )
//       .then(c => {
//         client = c;
//         console.log("Connected successfully to mongodb server");
//         resolve();
//       })
//       .catch(error => console.error(error));
//   });
// }
//
// function getPosts(query) {
//   return new Promise((resolve, reject) => {
//     client
//       .dbName
//       .collection("posts")
//       .find(query)
//       .toArray()
//       .then(documents => {
//         console.log("Got data");
//         resolve(documents);
//       })
//       .catch(error => console.error(error));
//   });
// }
//
// function addPost(title, description) {
//   return new Promise((resolve, reject) => {
//     let post = { title: title, description: description };
//     client
//       .db(dbName)
//       .collection("posts")
//       .insertOne(post)
//       .then(result => {
//         console.log("Post inserted");
//         resolve(result.insertedId);
//       })
//       .catch(error => console.error(error));
//   });
// }
//
// function getPostById(query) {
//   return new Promise((resolve,reject) => {
//     client.dbName.collection("posts").find(query).toArray().then(
//       (documents) => {
//         console.log("Got post id");
//         resolve(documents);
//       }).catch((error) => console.error(error));
//   });
//
// }

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);


