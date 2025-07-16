const UserModel = require("../model/userModels");

const getUserForSidebar = async (req, res, next) => {
    try {

        const loggedInUserId = req.userId
        const getAllUsers = await UserModel.find({
            _id: { $ne: loggedInUserId }
    }).select('-password')

        res.status(200).json({
            status: true,
            data: getAllUsers
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getUserForSidebar
}