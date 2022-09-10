const express = require("express")
const router = express.Router()

const User = require('../models/userModel')
const Keyword = require('../models/keywordModel')
const bcrypt = require('bcrypt')
const saltRounds = 10


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

// Route for updating user profile // Fabrice
router.put("/user/:username", async function (req, res) {
    let mainExpertise = req.body.mainExpertise
    try {
        let { username } = req.params

        let oldKeywords = await Keyword.find({}).populate({
            path: 'users',
            match: { username: username }
        })
        console.log("oldKeywords: " + oldKeywords)

        let keywordsToRemoveUserFrom = []
        // let keywordsToAddUserTo = []
        let keywordsToKeep = []


        let user = await User.findOne({ username })
        console.log("user: " + user)

        for (let i = 0; i < oldKeywords.length; i++) {
            req.body.keywords.includes(oldKeywords[i]._id) ?
                keywordsToKeep.push(oldKeywords[i]._id) :
                keywordsToRemoveUserFrom.push(oldKeywords[i]._id)
        }

        for (let i = 0; i < req.body.keywords.length; i++) {
            let keyword = req.body.keywords[i]
            console.log("forloop keyword: " + keyword)
            if (!oldKeywords.includes(keyword)) { //" keywordsToAddUserTo "
                let keywordExists = await Keyword.findOne({ keyword })
                console.log("keywordExists: " + keywordExists)
                if (keywordExists) {
                    console.log('in If Keyword Exists statement, now updating ?')
                    // add user._id to keyword.user
                    await Keyword.findOneAndUpdate({ keyword }, { $push: { users: user._id } })

                    // keywordExists.users.push(req.user._id) // geht das ? direkt in der DB // Fabrice

                } else {// hier sicherstellen alles vom Keyword wird ausgefüllt
                    console.log('in Else Keyword Exists statement, now creating new Keyword with user in it? userID: ')
                    console.log("user in else:" + user)

                    let newKeyword = new Keyword({ keyword: keyword, synonyms: [], oftenUsedTogether: [], searchedTimes: 0, amountUsedAsMainExpertise: 0, amountUsedAsKeyword: 1, users: [user._id] }) // add User to user array

                    await newKeyword.save().then(result => {
                        console.log("newKeyword saved: " + result)
                    })

                    user.keywords.push(newKeyword)


                    // user.save().then(result => {
                    //     console.log("user saved: " + result)
                    // })
                }
            }
        }

        user.mainExpertise = mainExpertise
        user.save().then(result => {
            console.log("user saved: " + result)
        })
        // user push keyword
        console.log("user before saving: " + user) // BIS HIER GEHT, alles andere herausgenommen weil bug

        // console.log("new keyword id: " + keywordResult._id)

        // let updatedUser = await User.findOneAndUpdate({ username: username }, { $set: { mainExpertise: req.body.mainExpertise, email: req.body.email }, $push: { keywords: keywordResult._id } }, { new: true })

        // console.log("updated User: " + updatedUser)
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
                        tokens: response.tokens,
                        id: response._id
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