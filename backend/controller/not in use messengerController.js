const User = require('../models/userModel');
const messageModel = require('../models/messageModel');
// const formidable = require('formidable');
const fs = require('fs');



const getLastMessage = async (myId, expertId) => {
     const msg = await messageModel.findOne({
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

module.exports.getContacts = async (req, res) => {
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
}

module.exports.messageUploadDB = async (req, res) => {
     console.log("in message Upload DB, req.body is: ", req.body);
     const {
          senderName,
          receiverId,
          message,
          senderId
     } = req.body
     // const senderId = req.myId;

     try {
          const insertMessage = await messageModel.create({
               // Here populate the sender thanks to senderId mongoose
               senderId: senderId,
               senderName: senderName,
               receiverId: receiverId,
               message: {
                    text: message
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }


}
module.exports.messageGet = async (req, res) => {
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

}

// Not using image sending
// module.exports.ImageMessageSend = (req,res) => {
//      const senderId = req.myId;
//      const form = formidable();

//      form.parse(req, (err, fields, files) => {
//           const {
//               senderName,
//               receiverId,
//               imageName 
//           } = fields;

//           const newPath = __dirname + `../../../frontend/public/image/${imageName}`
//           files.image.originalFilename = imageName;

//           try{
//                fs.copyFile(files.image.filepath, newPath, async (err)=>{
//                     if(err){
//                          res.status(500).json({
//                               error : {
//                                    errorMessage: 'Image upload fail'
//                               }
//                          })
//                     } else{
//                          const insertMessage = await messageModel.create({
//                               senderId : senderId,
//                               senderName : senderName,
//                               receiverId : receiverId,
//                               message : {
//                                    text: '',
//                                    image : files.image.originalFilename
//                               }
//                          })
//                          res.status(201).json({
//                               success : true,
//                               message: insertMessage
//                          })

//                     }
//                } )

//           }catch (error){
//                res.status(500).json({
//                     error : {
//                          errorMessage: 'Internal Sever Error'
//                     }
//                })

//           }


//      })
// }

module.exports.messageSeen = async (req, res) => {
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
}


module.exports.deliveredMessage = async (req, res) => {
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
}