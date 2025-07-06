const express = require("express");
const contactController = require("../controllers/contactController");

const router = express.Router();

// @route   POST /api/contact
router.post("/", contactController.sendContactEmail);

module.exports = router;
