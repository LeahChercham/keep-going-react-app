const express = require("express")
const router = express.Router()

const User = require('../models/userModel')
const Message = require('../models/messageModel')

const getLastMessage = async (myId, expertId) => {
    const msg = await Message.findOne({
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
    return msg;
}

router.get('/messenger/get-contacts/:myId', async function (req, res) {
    const myId = req.params.myId;
    let contactMessages = [];
    try {
        const getContacts = await User.find({
            _id: {
                $ne: myId
            }
        });
        for (let i = 0; i < getContacts.length; i++) {
            let lastMessage = await getLastMessage(myId, getContacts[i]._id);
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
    const {
        senderName,
        receiverId,
        message,
        senderId
    } = req.body

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
        let getAllMessage = await Message.find({

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

    await Message.findByIdAndUpdate(messageId, {
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

    await Message.findByIdAndUpdate(messageId, {
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