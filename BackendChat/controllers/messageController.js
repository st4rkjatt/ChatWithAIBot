const ConversationModel = require("../model/conversationModel");
const mongoose = require('mongoose');
const MessageModel = require('../model/messageModel');
const UserModel = require("../model/userModels");

// const sendMessage = async (req, res, next) => {
//     try {
//         const { message } = req.body;

//         const senderId = req.userId;
//         const receiverId = req.params.id;

//         // console.log(senderId, message, receiverId, '?')
//         let conversation = await ConversationModel.findOne({
//             participants: { $all: [senderId, receiverId] }
//         });

//         if (!conversation) {
//             conversation = await ConversationModel.create({
//                 participants: [senderId, receiverId],
//             });
//         }

//         const newMessage = new MessageModel({
//             senderId,
//             receiverId,
//             message
//         });

//         conversation.messages.push(newMessage._id);

//         console.log(conversation,"conversation")
//         await Promise.all([conversation.save(), newMessage.save()]);
//         res.status(200).json({
//             status: true,
//             message: message
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }
const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const senderId = req.userId;
        const receiverId = req.params.id;
        if (!message) {
            return res.status(400).json({
                status: false,
                message: 'Message is required.'
            })
        }
        if (!senderId || !receiverId) {
            return res.status(400).json({
                status: false,
                message: 'Sender and receiver are required.'
            })
        }
        // console.log(message, receiverId, "???")
        const isExits = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        // console.log(isExits, "exits")

        // check first both user exits in user table or not 
        const sender = await UserModel.findById(senderId);
        const receiver = await UserModel.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(400).json({
                status: false,
                message: 'Users are not found in the database.'
            });
        }

        if (!isExits) {
            const conversation = await ConversationModel.create({
                participants: [senderId, receiverId],
            });
            const newMessage = await MessageModel.create({
                senderId,
                receiverId,
                message
            });
            conversation.messages.push(newMessage._id);
            await conversation.save();
            console.log('first')
            return res.status(200).json({
                status: true,
                message: 'Message sent successfully',
                data: newMessage
            });
        }
        // console.log('first2')

        // Find an existing conversation or create a new one
        let conversation = await ConversationModel.findOneAndUpdate(
            { participants: { $all: [senderId, receiverId] } }, // Corrected: Use $all to match all elements
            { $setOnInsert: { participants: [senderId, receiverId] } }, // Corrected: Use $setOnInsert for the update operation
            { new: true, upsert: true } // Correct options syntax
        );

        // console.log(conversation, "conversation")
        // Create a new message
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            message
        });

        // Add the new message to the conversation
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Respond with success
        res.status(200).json({
            status: true,
            message: 'Message sent successfully',
            data: newMessage // Optionally include the new message in the response
        });
    } catch (error) {
        console.error(error); // Improved error logging
        next(error); // Pass the error to the next middleware (e.g., error handler)
    }
};
const getMessage = async (req, res, next) => {
    try {
        // pagination 
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const skip = (page - 1) * limit
        const { id: userToChatId } = req.params;
        const senderId = req.userId;
        const conversation = await ConversationModel.findOne({
            participants: { $all: [userToChatId, senderId] }
        }).populate({
            path: "messages",
        });

        // if (!conversation) {
        //     return res.status(400).json({
        //         status: false,
        //         message: 'Conversation not found.'
        //     })
        // }
        const conversations = conversation?.messages

        // console.log(conversations, "conversations")
        res.status(200).json({ status: true, message: conversations });

    } catch (error) {
        console.log(error, 'err');
        next(error);
    }
}

const getLastMessage = async (req, res, next) => {
    try {

        const { receiverId, type, limit } = req.body;
        const senderId = req.userId;

        if (!senderId || !receiverId) {
            return res.status(400).json({
                status: false,
                message: 'Sender and receiver are required.'
            })
        }


        const conversation = await ConversationModel.aggregate([
            {
                $match: {
                    participants: {
                        $all: [
                            new mongoose.Types.ObjectId(senderId),
                            new mongoose.Types.ObjectId(receiverId),
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: 'messages',
                    foreignField: '_id',
                    as: 'messagesInfo',
                },
            },
            { $unwind: '$messagesInfo' },
            { $sort: { 'messagesInfo.createdAt': -1 } },
            { $limit: limit },
            {
                $replaceRoot: { newRoot: '$messagesInfo' }
            }
        ]);

        console.log(conversation, 'conversation')
        return res.status(200).json({ message: "Last messages found", status: true, result: conversation });

    } catch (error) {
        console.log(error, 'error')
    }
}

module.exports = { sendMessage, getMessage, getLastMessage };
