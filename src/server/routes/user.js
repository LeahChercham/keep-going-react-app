const express = require("express")
const router = express.Router()

const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10

// Bcrypt = npm package that allows to encrypt passwords using hashing and salting
router.post("/user", function (req, res) {
    let password = req.body.password
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) { console.log(err) }
        req.body.password = hash
        let newUser = new User(req.body)
        console.log(req.body);
        newUser.save().then(result => {
            console.log('user saved!')
        })
        res.end()
    })
})

router.put("/user/:username", function (req, res) {
    console.log(req.body)
    let { username } = req.params
    User.findOneAndUpdate({ username }, req.body, { new: true }).then(result => {
        res.send(result)
    })
})


// route to see if username already exists 
router.get("/user/username/:username", function (req, res) {
    let { username } = req.params
    User.findOne({ username }, function (error, response) {
        res.send(response)
    })
})

// route to see if email already exists 
router.get("/user/email/:email", function (req, res) {
    let { email } = req.params
    User.findOne({ email }, function (error, response) {
        res.send(response)
    })
})

// route for log in
router.get('/login/:username/:password', function (req, res) {
    let { username, password } = req.params
    User.findOne({ username }, function (err, response) {
        let data
        if (!response) {
            data = { allowLogin: false }
            res.send(data)
            res.end()
        } else {
            let hash = response.password
            bcrypt.compare(password, hash, function (err, answer) {
                if (answer === true) {
                    user = {
                        username: response.username,
                        email: response.email,
                        mainExpertise: response.mainExpertise,
                        mainExpertiseKeywords: response.mainExpertiseKeywords,
                        otherKeywords: response.otherKeywords
                    }
                    data = { allowLogin: true, user }
                    res.send(data)
                } else {
                    data = { allowLogin: false }
                    res.send(data)
                }
            })
        }
    })
})


module.exports = router