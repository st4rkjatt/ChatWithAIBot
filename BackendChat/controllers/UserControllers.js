const UserModel = require("../model/userModels");
const jwt = require("jsonwebtoken");
const ErrorMiddleware = require("../utils/ErrorHandler");
const nodemailer = require("nodemailer");
const randomnumber = require("randomstring");
const ErrorHandler = require("../utils/ErrorHandler");
const config = {
  userEmail: process.env.USER_EMAIL ,
  userPassword: process.env.USER_PASSWORD,
  secret: process.env.USER_SECRET,
};

module.exports.Register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName) {
      return res
        .status(400)
        .json({ status: false, message: "User name is required!" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "User email is required!" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ status: false, message: "User password is required!" });
    }
    const checkUser = await UserModel.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    }).select("-password");

    if (checkUser) {
      return res
        .status(400)
        .json({ status: false, message: "User Already exits." });
    }
    const createUser = await UserModel.create({
      ...req.body,
    });

    const newUser1 = createUser.toJSON();
    delete newUser1.password;

    const maxAge = 24 * 60 * 60; // 1 day in seconds
    const token = jwt.sign(
      { id: createUser._id, userName, email: email },
      process.env.SECRET,
      {
        expiresIn: maxAge,
      }
    );
    // console.log(token, "token")
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // Convert seconds to milliseconds
    });
    console.log('2222222222222222')
    res.status(200).json({
      status: true,
      data: {
        ...newUser1,
        token,
      },
      message: "User has created successfully.",
    });
  } catch (error) {
    next(error);
  }
};


module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "User email is required!" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ status: false, message: "User password is required!" });
    }

    const checkUser = await UserModel.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });
    if (!checkUser) {
      return next(new ErrorHandler("User email not found.", 400));
    }

    if (password != checkUser.password) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user password" });
    }


    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { id: checkUser._id, userName: checkUser.userName, email: email },
      process.env.SECRET,
      {
        expiresIn: maxAge, // 3hrs in sec
      }
    );
    const userTokenUpdate = await UserModel.findOneAndUpdate(
      { email: { $regex: `^${email}$`, $options: "i" } },
      { token: token },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    const user1 = checkUser.toJSON();
    delete user1.password;
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });

    res.status(200).json({
      status: true,
      data: { ...user1, token },
      message: "User login successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.ForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorMiddleware("Email is required.", 400));
    }

    // Check if the email exists in your database
    const data = await UserModel.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!data) {
      return next(new ErrorMiddleware("This email doesn't exist.", 400));
    }

    // Generate a random OTP
    const OTP = randomnumber.generate({
      length: 6,
      charset: "numeric",
    });

    // Send OTP via email
    const mailOptions = {
      from: config.userEmail,
      to: email,
      subject: "Forgot password",
      text: `Your OTP  : ${OTP}`,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Change this to your email service provider
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.userEmail, // Change this to your email
        pass: config.userPassword, // Change this to your email password
      },
    });

    const updateUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
        otp: OTP,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    // console.log(updateUser, "updateUser");
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error, "errro");
        return next(new ErrorMiddleware("Failed to send email.", 500));
      }
      // console.log("Email sent: " + info.response);

      res.status(200).json({
        status: true,
        msg: "OTP has been sent successfully.",
        data: req.body,
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.VerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return next(new ErrorMiddleware("Email is required.", 400));
    }
    if (!otp) {
      return next(new ErrorMiddleware("OTP is required.", 400));
    }

    const data = await UserModel.findOne({ email: email });

    if (!data) {
      return next(new ErrorMiddleware("Email did not match.", 400));
    }

    if (otp != data.otp) {
      return next(new ErrorMiddleware("Invalid OTP", 400));
    }

    res.status(200).json({
      status: true,
      msg: "OTP has been verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};
module.exports.ResetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email) {
      return next(new ErrorMiddleware("Email is required.", 400));
    }
    if (!password) {
      return next(new ErrorMiddleware("Password is required.", 400));
    }
    if (!confirmPassword) {
      return next(new ErrorMiddleware("Confirm Password is required.", 400));
    }
    if (password != confirmPassword) {
      return next(new ErrorMiddleware("Password didn't match.", 400));
    }
    if (password.length < 6) {
      return next(
        new ErrorMiddleware("Password  must be greater than 6 digit", 400)
      );
    }

    // Check if the email exists in your database

    const data = await UserModel.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!data) {
      return next(new ErrorMiddleware("This email doesn't exist.", 400));
    }

    console.log(data, "datas");
    if (!data.otp) {
      return next(
        new ErrorMiddleware("Unexpected authentication failure", 400)
      );
    }

    const updateUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
        password: password,
        otp: "",
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
      status: true,
      msg: "Password has been changed successfully.",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUser = async (req, res, next) => {
  try {
    const { token } = req.query;
    console.log(token);
    res.status(200).json({
      status: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};
