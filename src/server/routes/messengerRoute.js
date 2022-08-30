const router = require('express').Router();

const { getContacts, messageUploadDB, messageGet, ImageMessageSend, messageSeen, deliveredMessage } = require('../controller/messengerController');

router.get('/messenger/get-contacts', getContacts);
router.post('/messenger/send-message', messageUploadDB);
router.get('/messenger/get-message/:expertId/:myId', messageGet);
// router.post('/messenger/image-message-send', ImageMessageSend); Not in use

router.post('/messenger/seen-message', messageSeen);
router.post('/messenger/delivered-message', deliveredMessage);


module.exports = router;