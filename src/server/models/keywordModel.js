const mongoose = require("mongoose")
const Schema = mongoose.Schema

const KeywordSchema = new Schema({
    keyword: String,
    synonyms: [{ keyword: { type: Schema.Types.ObjectId, ref: 'Keyword' } }],
    oftenUsedTogether: [{ keyword: { type: Schema.Types.ObjectId, ref: 'Keyword' } }],
    searchedTimes: Integer,
    amountUsedAsMainExpertise: Integer,
    amountUsedAsKeyword: Integer,
    users: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }]
})

const Keyword = mongoose.model('keyword', KeywordSchema)
module.exports = Keyword