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

router.get('/offer/get-contacts/:myId', async function (req, res) {
    const myId = req.params.myId;
    let contactOffers = [];
    try {
        const getContacts = await User.find({
            _id: {
                $ne: myId
            }
        }).populate({ path: 'keywords' });

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
        offer,
        senderId,
        askerId,
        answererId
    } = req.body

    let price = offer.price

    let newOffer = new Offer({
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        offer: {
            price: price,
        },
        status: "false",
        askerId: askerId,
        answererId: answererId,
    })

    try {
        await newOffer.save().then(result => {
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

    try {
        const { _id, answererId, askerId, senderId, receiverId } = req.body
        const price = req.body.offer.price
        const offerId = _id

        let idToUse = offerId

        if (!offerId) {
            let ofr = await getLastOffer(senderId, receiverId)
            if (ofr._id) {
                idToUse = ofr._id
            } else {
                idToUse = ofr.id
            }
        }

        await Offer.findByIdAndUpdate(idToUse, { status: req.body.status }, { new: true }) 
        if (req.body.status === "accepted") {
            await User.findByIdAndUpdate(answererId, { $inc: { tokens: price } }) 
            await User.findByIdAndUpdate(askerId, { $inc: { tokens: -price } }) 
        }

        let offer = await Offer.findById(idToUse); 

        console.log(offer)
        res.status(200).json({ 
            success: true,
            offer: offer
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