const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = 7777

const user = require('./user')

let app = express();

app.use(express.static(path.join(__dirname, "build")))
// app.use(express.static('node_modules'));

// Set Api Routes
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  next()
})

// Necessary to parse the JSON from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/KeepGoingDB', { useNewUrlParser: true }, () => console.log("Connected to DB"))


app.use('/', user)

//This is a "catch-all" route handler, essentially saying that if the server did not register any of the other routes, it will send the index.html file from the build. 
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT || PORT, () => console.log(`Running on port ${PORT}`))
