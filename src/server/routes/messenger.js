const express = require("express")
const router = express.Router()

const User = require('../models/userModel')
const Message = require('../models/messageModel')

router.get('/messenger/get-contacts', async function (req, res) {
    const myId = req.myId;
    let contactMessages = [];
    try {
        const getContacts = await User.find({
            // Here something to populate contacts in user model and then get them Users
        });
        for (let i = 0; i < getContacts.length; i++) { // Here it gets the last message of each conversation
            let lastMessage = await getLastMessage(myId, getContacts[i].id);
            contactMessages = [...contactMessages, {
                contactInfo: getContacts[i],
                messageInfo: lastMessage
            }]

        }

        res.status(200).json({ success: true, contacts: contactMessages })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Sever Error'
            }
        })
    }

});

router.post('/messenger/send-message', async function (req, res) {
    console.log("in message Upload DB, req.body is: ", req);
    const {
        senderName,
        receiverId,
        message,
        senderId
    } = req.body
    // const senderId = req.myId;

    let newMessage = new Message({
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        message: {
            text: message
        },
        status: false
    })

    try {
        newMessage.save().then(result => {
            let message = result
            res.status(201).json({
                successMessage: "User created", message
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

router.get('/messenger/get-message/:expertId/:myId', async function (req, res) {
    const expertId = req.params.expertId;
    const myId = req.params.myId;

    try {
        let getAllMessage = await messageModel.find({

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

        // getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.receiverId === expertId || m.receiverId ===  myId && m.senderId === expertId );

        res.status(200).json({
            success: true,
            message: getAllMessage
        })

    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal Server error'
            }
        })

    }


});

// router.post('/messenger/image-message-send', ImageMessageSend); Not in use

router.post('/messenger/seen-message', async function (req, res) {
    const messageId = req.body._id;

    await messageModel.findByIdAndUpdate(messageId, {
        status: 'seen'
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

router.post('/messenger/delivered-message', async function (req, res) {
    const messageId = req.body._id;

    await messageModel.findByIdAndUpdate(messageId, {
        status: 'delivered'
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