const User = require('../models/userModel')
const Keyword = require('../models/keywordModel')

const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const { isArray, util } = require('util')
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
    }).populate({ path: 'keywords' })
})

// route to see if email already exists 
router.get("/user/email/:email", function (req, res) {
    let { email } = req.params
    User.findOne({ email }, function (error, response) {
        res.send(response)
    }).populate({ path: 'keywords' })
})

// Route for updating user profile // Fabrice
router.put("/user/:username", async function (req, res) {

    try {
        let mainExpertise = req.body.updateUser.mainExpertise
        let oldKeywords = req.body.oldKeywords

        let { username } = req.params

        let keywordsToRemoveUserFrom = []
        let keywordsToKeep = []


        let user = await User.findOne({ username })

        if (oldKeywords.length > 0) {

            for (let i = 0; i < oldKeywords.length; i++) {
                req.body.updateUser.keywords.includes(oldKeywords[i].word) ?
                    keywordsToKeep.push(oldKeywords[i]._id) :
                    keywordsToRemoveUserFrom.push(oldKeywords[i]._id)
            }
        }


        let oldKeywordsWords = oldKeywords.map(keyword => {

            return keyword.word
        })

        for (let i = 0; i < req.body.updateUser.keywords.length; i++) {
            let word = req.body.updateUser.keywords[i]

            if (!oldKeywordsWords.includes(word)) { //" keywordsToAddUserTo "
                let keywordExists = await Keyword.findOne({ word })
                if (keywordExists) {
                    // add user._id to keyword.user
                    let existKeyw = await Keyword.findOneAndUpdate({ word }, { $push: { users: user._id }, $inc: { amountUsedAsKeyword: 1 } }, { new: true })
                    await User.findOneAndUpdate({ username: username }, { $push: { keywords: existKeyw } }) // 

                } else {// WORKS

                    let newlySavedKeyword = await new Keyword({ word: word, synonyms: [], oftenUsedTogether: [], searchedTimes: 0, amountUsedAsMainExpertise: 0, amountUsedAsKeyword: 1, users: [user._id] })

                    await newlySavedKeyword.save().then((res) => {

                        User.findOneAndUpdate({ username: username }, { $push: { keywords: res } }, { new: true }).then((res) => {
                            console.log(res)
                        })
                    })
                }
            }
        }

        for (let i = 0; i < keywordsToRemoveUserFrom.length; i++) {
            let keyword = keywordsToRemoveUserFrom[i]
            await Keyword.findOneAndUpdate({ _id: keyword }, { $pull: { users: user._id }, $inc: { amountUsedAsKeyword: -1 } }, { new: true })

            await User.findOneAndUpdate({ username: username }, { $pull: { keywords: keyword } }, { new: true })
        }

        user = await User.findOneAndUpdate({ username: username }, { $set: { mainExpertise: mainExpertise } }, { new: true }).populate({ path: 'keywords' })


        let sendUser = { ...user }

        res.status(201).json({
            successMessage: "User updated",
            user: sendUser._doc
        })


    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            error: { errorMessage: ['Internal Server Error', "Updating User went wrong"] }
        })
    }

})


// route for log in
router.get('/login/:username/:password', function (req, res) {
    let { username, password } = req.params

    User.findOne({ username: username }).populate({ path: 'keywords' }).exec(function (err, response) {
        let data
        if (!response) {
            data = { error: { errorMessage: "No Response" } }
            res.send(data)
            res.end()
        } else {
            let getKeywords = []
            response.keywords ? response.keywords.map(keyword => { getKeywords.push(keyword) }) : null
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

    let foundKeywords = []
    let users = []
    let data = [] // users to be send back, populated obviously
    // let found

    for (let i = 0; i < keywords.length; i++) {
        multipleFound = await Keyword.find({ word: { $regex: keywords[i], $options: 'i' } }).populate({
            path: 'users', populate: {
                path: 'keywords',
            }
        })

        multipleFound.map(found => {
            doc = { ...found._doc }
            foundKeywords.push(doc)
            doc.users.map((user) => { users.push(user) })

        })

    }

    // Remove duplicates
    let uniqueIds = []
    let uniqueUsers = users.filter(element => {

        let isDuplicate = uniqueIds.includes(element.id)
        if (!isDuplicate) {
            uniqueIds.push(element.id)
            return true
        }
        return false
    })

    data = uniqueUsers

    res.send(data)
}
)


module.exports = router