const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//const blogPostRouter = require('./blogpost');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { BlogPost } = require('./model');

app.use(bodyParser.json());

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/posts', (req, res) => {
  const filters = {}
  BlogPost
    .find(filters)
    .then(BlogPosts => res.json(
            BlogPosts.map(blogpost => blogpost.serialize())
    ))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});
// can also request by ID
app.get('posts/:id', (req, res) => {
  BlogPost
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(blogpost => res.json(blogpost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});


// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
