const mongoose = require('mongoose')
const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["text", "video", "img"],
        default:"text"
    },
}, { timestamps: true })
const MessageModel = mongoose.model("message", messageSchema)
module.exports = MessageModel