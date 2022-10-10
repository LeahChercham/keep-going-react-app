const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String, // The password will not be the real password, but the encryption of the password.
    mainExpertise: String,
    mainExpertiseKeywords: String, // old
    mainExpertiseKeywordsArray: [String], // old
    keywords: [ { type: Schema.Types.ObjectId, ref: 'Keyword' } ], //new
    otherKeywords: String, // old
    tokens: Number,
    contacts: [ { type: Schema.Types.ObjectId, ref: 'User' }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User