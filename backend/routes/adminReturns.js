const express = require("express");
const router = express.Router();
const {
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/returnExchangeController");
const admin = require("../middleware/admin");

// Get all return requests
router.get("/", getAllRequests);

// Update request status (approve/reject)
router.patch("/:id", updateRequestStatus);

module.exports = router;
