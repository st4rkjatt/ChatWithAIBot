const {
  Register,
  Login,
  ForgetPassword,
  VerifyOTP,
  ResetPassword,
  getAllUser,
} = require("../controllers/UserControllers");
const passport = require("passport");
const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getUserForSidebar } = require("../controllers/usersController");
router.post("/register", Register);
router.post("/login", Login);
router.post("/forget-password", ForgetPassword);
router.post("/verify-otp", VerifyOTP);
router.post("/reset-password", ResetPassword);
router.get("/get-all-user", auth, getAllUser);



module.exports = router;
