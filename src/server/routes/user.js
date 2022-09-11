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
    try {
        let mainExpertise = req.body.mainExpertise
        let { username } = req.params

        // let oldKeywords = await Keyword.find({}).populate({ // das findet alle keywords leider und nicht nur die des users
        //     path: 'users',
        //     match: { username: username }
        // })
        let oldKeywords = []
        await User.findOne({ username: username }).populate({ path: 'keywords' }).then((user) => {
            oldKeywords = user.keywords
        })
        console.log("oldKeywords: " + oldKeywords)

        let keywordsToRemoveUserFrom = []
        // let keywordsToAddUserTo = []
        let keywordsToKeep = []


        let user = await User.findOne({ username })
        console.log("user: " + user)
        // Bis hier alles ok

        for (let i = 0; i < oldKeywords.length; i++) {
            req.body.keywords.includes(oldKeywords[i]._id) ?
                keywordsToKeep.push(oldKeywords[i]._id) :
                keywordsToRemoveUserFrom.push(oldKeywords[i]._id)
        }

        console.log("keywordsToRemoveUserFrom: " + keywordsToRemoveUserFrom)
        console.log("keywordsToKeep: " + keywordsToKeep)

        for (let i = 0; i < req.body.keywords.length; i++) {
            let word = req.body.keywords[i]
            let newlySavedKeyword
            console.log("forloop word: " + word)
            if (!oldKeywords.includes(word)) { //" keywordsToAddUserTo "
                let keywordExists = await Keyword.findOne({ word })
                console.log("keywordExists: " + keywordExists)
                if (keywordExists) {
                    console.log('in If Keyword Exists statement, now updating ?')
                    // add user._id to keyword.user
                    let existKeyw = await Keyword.findOneAndUpdate({ word }, { $push: { users: user._id } }, { new: true })
                    console.log("existKeyw: " + existKeyw)
                    await User.findOneAndUpdate({ username: username }, { $push: { keywords: existKeyw } }) // wenn das geht im Else statement das (find one) entfernen
                    // keywordExists.users.push(req.user._id) // geht das ? direkt in der DB // Fabrice

                } else {// WORKS
                    console.log('Else Statement Running')

                    let newlySavedKeyword = new Keyword({ word: word, synonyms: [], oftenUsedTogether: [], searchedTimes: 0, amountUsedAsMainExpertise: 0, amountUsedAsKeyword: 1, users: [user._id] })

                    newlySavedKeyword.save().then((res) => {
                        console.log(" newlySavedKeyword save res: " + res)

                        User.findOneAndUpdate({ username: username }, { $push: { keywords: res } }, { new: true }).then((res) => {
                            console.log("updated " + res)
                        })
                    })
                }
            }
        }

        await User.findOneAndUpdate({ username: username }, { $set: { mainExpertise: mainExpertise } }, { new: true }).then(result => {
            console.log('updated Main Expertise' + result)
        })  

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
    console.log('in get route')
    console.log('username: ' + username)
    User.findOne({ username: username }).populate('keywords').exec(function (err, response) {
        console.log("in test: " + response)
    })
    User.findOne({ username: username }).populate('keywords').exec(function (err, response) {
        let data
        if (!response) {
            data = { error: { errorMessage: "No Response" } }
            res.send(data)
            res.end()
        } else {
            let getKeywords = []
            console.log("response: " + response)
            response.keywords ? response.keywords.map(keyword => { getKeywords.push(keyword) }) : null
            console.log("get keywords? " + getKeywords)
            let hash = response.password
            bcrypt.compare(password, hash, function (err, answer) {
                if (answer === true) {
                    user = {
                        username: response.username,
                        email: response.email,
                        mainExpertise: response.mainExpertise,
                        mainExpertiseKeywords: response.mainExpertiseKeywords,
                        keywords: getKeywords,
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