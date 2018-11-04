const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// uuid
const uuid = require("uuid/v4");

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

const posts = [
  {
    id: uuid(),
    title: "Angular 6 configurations of the dev server?",
    description:
      "I hope someone could help me with this because I've been trying to switch from webpack to angular cli. I've accomplished that but when others. Any ideas?",
  },
  {
    id: uuid(),
    title: "Angular change set data from API?",
    description:
      "Hey so I'm using an openAPI to get some data. Everything reads in correctly now I want to change the data. How can this be done? I want to change the data to my set times instead."
  },
  {
    id: uuid(),
    title:
      "Angular material accordion based on user input override user click on input?",
    description:
      "I'm trying to build a small accordion using Angular Material which contain that string. How can this be done? I want to change the data to my set times instead."
  }
];
const comments = [
  {
    id: uuid(),
    postId: posts[0].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file",
    likes: 1,
    dislikes: 1
  },
  {
    id: uuid(),
    postId: posts[0].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage of ",
    likes: 1,
    dislikes: 1
   },
  {
    id: uuid(),
    postId: posts[1].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take advantage.",
    likes: 1,
    dislikes: 1
  },
  {
    id: uuid(),
    postId: posts[2].id,
    answer:
      "I want to match the state in the below csv file to the zip code in another csv file. My dataset also does not contain that many states so I was thinking I could take.",
    likes: 1,
    dislikes: 1
  }
];

// posts
app.get("/api/post", (req, res) => res.json(posts));

app.post("/api/post", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let id = uuid();
  const post = {
    id: id,
    title: title,
    description: description
  };

  posts.push(post);
  res.json(post);
});

app.get("/api/post/:id", (req, res) => {
  const post = findPostById(req.params.id);
  // TODO: If post is null, you should throw 404
  res.json(post);
});

app.post("/api/comment", (req, res) => {
  const { answer, postId} = req.body;

  const comment = {
    id: uuid(),
    answer,
    postId
  };

  comments.push(comment);

  res.json(comment);
});

app.get("/api/comment", (req, res) => {
  const { postId } = req.query;
  if (typeof postId === "string") {
    const commentsForPost = comments.filter(
      comment => comment.postId === postId
    );
    res.json(commentsForPost);
  } else {
    res.json(comments);
  }
});

app.get("/api/comment/:id", (req, res) => {
  const comment = findCommentById(req.params.id);
  // TODO: If comment is null, you should throw 404
  res.json(comment);
});

// app.post("api/comment/:id/vote", (req, res) => {
//   const index = findCommentIdxById(req.params.id);
//   const isUp = req.body.up;
//   if (index !== -1) {
//     const comment = comments[index];
//     const { vote } = comment;
//     comments.splice(index, 1, {
//       ...comment,
//       vote: {
//         ...vote,
//         count: vote.count + 1,
//         score: isUp ? (vote.count + 5) : (vote.count - 5)
//       }
//     })
//   }
// });

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

/**** Reroute all unknown requests to angular index.html ****/
app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/mandatory_exercise/index.html"));
});

/**** Start ****/
app.listen(port, () =>
  console.log(`Mandatory exercise API running on port ${port}!`)
);
