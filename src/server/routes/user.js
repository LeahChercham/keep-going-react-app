const express = require("express")
const router = express.Router()

const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const util = require("util")

// Bcrypt = npm package that allows to encrypt passwords using hashing and salting
router.post("/user", function (req, res) {
    let password = req.body.password
    let error = ""
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
        }
        req.body.password = hash
        let newUser = new User(req.body)
        try {
            newUser.save().then(result => {
                let user = result
                res.status(201).json({
                    successMessage: "User created", user
                })
            })
        }
        catch (err) {
            res.status(500).json({
                error: { errorMessage: ['Internal Server Error'] }
            })
        }

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

// Route for updating user profile
router.put("/user/:username", async function (req, res) {
    let { username } = req.params
    try {
        let user = await User.findOneAndUpdate({ username: username }, req.body, { new: true })

        console.log("user doc: " + user.username)
        res.status(201).json({
            successMessage: "User updated",
            user
        })
    }
    catch {
        res.status(500).json({
            error: { errorMessage: ['Internal Server Error', "Updating User went wrong"] }
        })
    }

})


// route for log in
router.get('/login/:username/:password', function (req, res) {
    let { username, password } = req.params
    User.findOne({ username }, function (err, response) {
        let data
        if (!response) {
            data = { error: { errorMessage: "Wrong username or password" } }
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
                        otherKeywords: response.otherKeywords,
                        tokens: response.tokens
                    }
                    data = { user, successMessage: "Login successfull" }
                    res.send(data)
                } else {
                    data = { error: { errorMessage: "Wrong username or password" } }
                    res.send(data)
                }
            })
        }
    })
})

// Route for searching keywords in user data
router.get('/user/search', async function (req, res) {
    let keywords = req.query.data

    let data = []
    for (let i = 0; i < keywords.length; i++) {
        let result = await User.find({ mainExpertiseKeywords: { $regex: keywords[i] } })
        data.push(result)
    }
    res.send(data)
}
)


module.exports = router