const express = require("express");
const router = express.Router();
const {
  createRequest,
  getUserRequests,
} = require("../controllers/returnExchangeController");
const auth = require("../middleware/auth");

// Create a return request
router.post("/", auth, createRequest);

// Get all requests for the logged-in user
router.get("/", auth, getUserRequests);

module.exports = router;
