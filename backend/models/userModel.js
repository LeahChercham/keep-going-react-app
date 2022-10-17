const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String, 
    mainExpertise: String,
    mainExpertiseKeywords: String, 
    mainExpertiseKeywordsArray: [String], 
    keywords: [ { type: Schema.Types.ObjectId, ref: 'Keyword' } ], 
    otherKeywords: String, 
    tokens: Number,
    contacts: [ { type: Schema.Types.ObjectId, ref: 'User' }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User