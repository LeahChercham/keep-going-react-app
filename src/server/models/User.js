const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String, // The password will not be the real password, but the encryption of the password.
    mainExpertise: String,
    mainExpertiseKeywords: String,
    otherKeywords: String,
    tokens: Number,
})

const User = mongoose.model('user', UserSchema)
module.exports = User