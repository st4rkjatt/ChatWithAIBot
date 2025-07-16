const { getUserForSidebar } = require("../controllers/usersController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.get("/", auth, getUserForSidebar);

module.exports = router;