const express = require("express")
const router = express.Router()

const Offer = require('../models/offerModel')
const User = require('../models/userModel')

const getLastOffer = async (myId, expertId) => {
    const ofr = await Offer.findOne({
        $or: [{
            $and: [{
                senderId: {
                    $eq: myId
                }
            }, {
                receiverId: {
                    $eq: expertId
                }
            }]
        }, {
            $and: [{
                senderId: {
                    $eq: expertId
                }
            }, {
                receiverId: {
                    $eq: myId
                }
            }]
        }]

    }).sort({
        updatedAt: -1
    });
    return ofr;
}

const updateUserTokens = async (userId, price, type) => {
    console.log('hello hello ')
    console.log(userId + type + price)

    let response

    if (type === "add") {
        await User.findByIdAndUpdate(userId, { $inc: { tokens: price } }).then((res) => {
            response = res
        })
    }

    if (type === "remove") {
        await User.findByIdAndUpdate(userId, { $inc: { tokens: -price } }).then((res) => {
            response = res
        })
    }

    if (type != "add" || type != "remove") { return null }

    console.log(response)
    return response
}

router.get('/offer/get-contacts/:myId', async function (req, res) {
    const myId = req.params.myId;
    let contactOffers = [];
    try {
        const getContacts = await User.find({
            _id: {
                $ne: myId
            }
        });

        for (let i = 0; i < getContacts.length; i++) {

            let lastOffer = await getLastOffer(myId, getContacts[i]._id);
            contactOffers = [...contactOffers, {
                contactInfo: getContacts[i],
                offerInfo: lastOffer
            }]

        }

        res.status(200).json({ success: true, contacts: contactOffers })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Sever Error'
            }
        })
    }

});

router.get('/offer/get-offer/:expertId/:myId', async function (req, res) {
    const expertId = req.params.expertId;

    const myId = req.params.myId;

    try {
        let getAllOffer = await Offer.find({

            $or: [{
                $and: [{
                    senderId: {
                        $eq: myId
                    }
                }, {
                    receiverId: {
                        $eq: expertId
                    }
                }]
            }, {
                $and: [{
                    senderId: {
                        $eq: expertId
                    }
                }, {
                    receiverId: {
                        $eq: myId
                    }
                }]
            }]
        })

        let lastOffer = await getLastOffer(myId, expertId);

        res.status(200).json({
            success: true,
            offer: lastOffer // instead of all offer
        })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server error'
            }
        })

    }


});

// hier post routes 
router.post('/offer/send-offer', async function (req, res) {

    const {
        senderName,
        receiverId,
        price,
        senderId,
        askerId,
        answererId
    } = req.body


    let newOffer = new Offer({
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        offer: {
            price: price,
        },
        status: false,
        askerId: askerId,
        answererId: answererId,
    })

    try {
        newOffer.save().then(result => {
            res.status(201).json({
                successMessage: "Offer created",
                offer: result
            })
        })
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Sever Error'
            }
        })
    }


});

router.post('/offer/delivered-offer', async function (req, res) {
    const { offer, answererId, askerId } = req.body.offer
    const price = offer.price
    const offerId = offer._id

    try {
        await Offer.findByIdAndUpdate(offerId, { status: req.body.offer.status }, { new: true })
        await User.findByIdAndUpdate(answererId, { $inc: { tokens: price } })
        await User.findByIdAndUpdate(askerId, { $inc: { tokens: -price } })

        res.status(200).json({
            success: true
        })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server Error'
            }
        })
    }

});

module.exports = router