const express = require("express");
const { tts, elevenAPITts } = require("../controllers/AIController");
const router = express.Router();
router.post("/tts", tts); 
router.post("/eleven-tts", elevenAPITts); 
module.exports = router;
