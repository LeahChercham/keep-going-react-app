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
    console.log(req.body)
    try {
        let mainExpertise = req.body.updateUser.mainExpertise
        let oldKeywords = []
        if (isArray(req.body.oldKeywords)) {
            oldKeywords = req.body.oldKeywords
        } else {
            oldKeywords.push(req.body.oldKeywords)
        }
        let { username } = req.params

        console.log('in put route')
        console.log("oldKeywords" + oldKeywords)

        // await User.findOne({ username: username }).populate({ path: 'keywords' }).exec((err, res) => {
        //     console.log("userkeywords: for old keywords" + res)
        //     console.log("reskeywords: " + res.keywords)
        //     if (res.keywords) {
        //         oldKeywords = res.keywords
        //     } else {
        //         oldKeywords = []
        //     }
        //     console.log("oldkeywords2: " + oldKeywords)
        // })

        let keywordsToRemoveUserFrom = []
        let keywordsToKeep = []


        let user = await User.findOne({ username })

        if (oldKeywords.length > 0) {

            for (let i = 0; i < oldKeywords.length; i++) {
                console.log("oldKeywords[i]: " + oldKeywords) // AM I STUPID ? Fabrice
                req.body.updateUser.keywords.includes(oldKeywords[i].word) ?
                    keywordsToKeep.push(oldKeywords[i]._id) :
                    keywordsToRemoveUserFrom.push(oldKeywords[i]._id)
            }
        }


        console.log("keywordsToRemoveUserFrom: " + keywordsToRemoveUserFrom)
        console.log("keywordsToKeep: " + keywordsToKeep)

        return null

        for (let i = 0; i < req.body.updateUser.keywords.length; i++) {
            let word = req.body.updateUser.keywords[i]

            console.log("forloop word: " + word)
            if (!oldKeywords.includes(word)) { //" keywordsToAddUserTo "
                let keywordExists = await Keyword.findOne({ word })
                console.log("keywordExists: " + keywordExists)
                if (keywordExists) {
                    console.log('in If Keyword Exists statement, now updating')
                    // add user._id to keyword.user
                    let existKeyw = await Keyword.findOneAndUpdate({ word }, { $push: { users: user._id }, $inc: { amountUsedAsKeyword: 1 } }, { new: true })
                    console.log("existKeyw: " + existKeyw)
                    await User.findOneAndUpdate({ username: username }, { $push: { keywords: existKeyw } }) // 

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

        for (let i = 0; i < keywordsToRemoveUserFrom.length; i++) {
            let keyword = keywordsToRemoveUserFrom[i]
            console.log("keyword: " + keyword)
            await Keyword.findOneAndUpdate({ word: keyword }, { $pull: { users: user._id }, $inc: { amountUsedAsKeyword: -1 } }, { new: true })

            await User.findOneAndUpdate({ username: username }, { $pull: { keywords: keyword } }, { new: true })
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

    User.findOne({ username: username }).populate({ path: 'keywords' }).exec(function (err, response) {
        console.log("in test: " + response)
    })
    User.findOne({ username: username }).populate({ path: 'keywords' }).exec(function (err, response) {
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