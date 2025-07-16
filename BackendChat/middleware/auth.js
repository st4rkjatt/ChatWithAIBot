const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModels");
const ErrorMiddleware = require("../utils/ErrorHandler");
module.exports.auth = async (req, res, next) => {
  try {

    const token = req.headers.authorization
    if (!token) {
      return res.status(403).json({ message: "Token not provided" });
    }


    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        console.log(err, 'error')
        // Change the status code to 403 for unauthorized access
        return res.status(403).json({ message: "Token has been expired" });
      }

      // Assuming you have a userId in the token payload
      req.userId = decoded.id;
      const findUser = await UserModel.findById(req.userId);
      if (!findUser) {
        return next(new ErrorMiddleware("User not found.", 400));
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
