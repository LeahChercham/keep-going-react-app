const mongoose = require("mongoose")
const Schema = mongoose.Schema

const KeywordSchema = new Schema({
    word: String,
    synonyms: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    oftenUsedTogether: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    searchedTimes: Number,
    amountUsedAsMainExpertise: Number,
    amountUsedAsKeyword: Number,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const Keyword = mongoose.model('Keyword', KeywordSchema)
module.exports = Keyword