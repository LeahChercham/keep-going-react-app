const express = require("express")
const router = express.Router()

const Offer = require('../models/offerModel')

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
    console.log("offer: ", ofr)
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
        });
        console.log('length: ' + getContacts.length)
        for (let i = 0; i < getContacts.length; i++) {
            console.log("in loop " + i + " myID / expert ID: " + myId + " / " + getContacts[i]._id)
            let lastOffer = await getLastOffer(myId, getContacts[i]._id);
            contactOffers = [...contactOffers, {
                contactInfo: getContacts[i],
                offerInfo: lastOffer
            }]

        }
        console.log("after loop" + contactOffers)
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

// hier post get routes
router.post('/offer/send-offer', async function (req, res) {
    console.log('req.body')
    console.log(req.body)

    const {
        senderName,
        receiverId,
        price,
        senderId
    } = req.body


    let newOffer = new Offer({
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        offer: {
            price: price,
        },
        status: false
    })

    try {
        newOffer.save().then(result => {
            console.log("saved ok")
            console.log(result)
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
    const offerId = req.body._id;
    console.log("route delivered-offer")
    console.log(req.body)

    await Offer.findByIdAndUpdate(offerId, {
        status: req.body.offer.status
    })
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch(() => {
            res.status(500).json({
                error: {
                    errorMessage: 'Internal Server Error'
                }
            })
        })

});

module.exports = router