const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema  = new Schema(
    {
        chatId:String,
        senderId:String,
        text:String,


    },
    {
        timestamps:true
    }

)
const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;