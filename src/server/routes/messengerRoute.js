const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, ImageMessageSend, messageSeen, delivaredMessage } = require('../controller/messengerController');

router.get('/get-friends', getFriends);
router.post('/send-message', messageUploadDB);
router.get('/get-message/:id', messageGet);
// router.post('/image-message-send', ImageMessageSend); Not in use

router.post('/seen-message', messageSeen);
router.post('/delivered-message', delivaredMessage);


module.exports = router;