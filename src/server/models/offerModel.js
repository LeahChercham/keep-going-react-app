const { model, Schema } = require('mongoose');

const offerSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    offer: {
        price: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = model('offer', offerSchema);