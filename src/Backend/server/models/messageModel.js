const {model,Schema} = require('mongoose');

const messageSchema = new Schema({
     // sender : 
     //    { type: Schema.Types.ObjectId, ref: 'User' },
  
     senderId : {
          type : String,
          required : true
     },
     senderName : {
          type: String,
          required : true
     },
     receiverId : {
          type: String,
          required : true          
     },
     message : {
          text : {
               type: String,
               default : ''
          }     
     },
     status :{
          type : String,
          default : 'unseen'
     }
},{timestamps : true});

module.exports = model('message',messageSchema);