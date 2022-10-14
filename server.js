const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = 5000
const path = require('path')
const cors = require('cors');
const user = require('./backend/routes/user')
const messenger = require('./backend/routes/messenger')
const offer = require('./backend/routes/offer')

// const messengerRoute = require('./routes/Not in Use messengerRoute')


let app = express();

app.use(cors());
app.options("", cors());

// Set Api Routes
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
})

app.use(express.static(path.join(__dirname, "frontend", "build")))
console.log(path.join(__dirname, "frontend", "build"));
app.use(express.static('node_modules'));

// Necessary to parse the JSON from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', user)
app.use('/', messenger)
app.use('/', offer)

mongoose.connect(process.env.MONGODB_URI
  || 'mongodb://127.0.0.1:27017/KeepGoingDB',
  { useNewUrlParser: true })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));


//This is a "catch-all" route handler, essentially saying that if the server did not register any of the other routes, it will send the index.html file from the build. 
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(process.env.PORT || PORT, () => console.log(`Running on port ${PORT}`))
