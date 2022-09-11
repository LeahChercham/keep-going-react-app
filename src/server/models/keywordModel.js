const mongoose = require("mongoose")
const Schema = mongoose.Schema

const KeywordSchema = new Schema({
    word: String,
    synonyms: [{ word: { type: Schema.Types.ObjectId, ref: 'Keyword' } }],
    oftenUsedTogether: [{ word: { type: Schema.Types.ObjectId, ref: 'Keyword' } }],
    searchedTimes: Number,
    amountUsedAsMainExpertise: Number,
    amountUsedAsKeyword: Number,
    users: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }]
})

const Keyword = mongoose.model('keyword', KeywordSchema)
module.exports = Keyword