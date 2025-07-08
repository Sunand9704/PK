const ReturnExchangeRequest = require("../models/ReturnExchangeRequest");
const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const sendReturnEmail = async (
  userEmail,
  userName,
  orderId,
  subject,
  message
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; border: 1px solid #eee;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #4F46E5; margin: 0;">PK Trends</h2>
            <p style="color: #666; margin: 8px 0;">Your Fashion Destination</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="color: #222; margin-top: 0;">Hello ${userName},</h3>
            <p style="color: #444; line-height: 1.6;">${message}</p>
            <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Order ID:</strong> ${orderId}
              </p>
            </div>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>Thank you for choosing PK Trends!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Optionally log error
    console.log("error in sending mail", error);
  }
};

// User: Create a return/exchange request
exports.createRequest = async (req, res) => {
  try {
    const { order, product, type, reason } = req.body;
    if (!order || !product || !type || !reason) {
      return res.status(400).json({ msg: "All fields are required." });
    }
    if (type !== "return") {
      return res.status(400).json({ msg: "Only return requests are allowed." });
    }
    // Optionally, check if the order and product belong to the user
    const newRequest = new ReturnExchangeRequest({
      user: req.user.id,
      order,
      product,
      type,
      reason,
    });
    await newRequest.save();
    // Populate for email
    const populatedRequest = await ReturnExchangeRequest.findById(
      newRequest._id
    )
      .populate("user", "firstName lastName email")
      .populate("order")
      .populate("product", "name");
    const user = populatedRequest.user;
    const orderObj = populatedRequest.order;
    const productObj = populatedRequest.product;
    // Send email to user
    if (user && user.email) {
      const userName = `${user.firstName} ${user.lastName}`;
      const subject = "Return Request Submitted - PK Trends";
      const message = `We have received your return request for order <b>${orderObj.orderId}</b> (Product: ${productObj.name}).<br><br>Reason: ${reason}<br><br>Our team will review your request and update you soon. You will receive another email once the status is updated by admin.`;
      await sendReturnEmail(
        user.email,
        userName,
        orderObj.orderId,
        subject,
        message
      );
      console.log("mail sended");
    } else {
      console.log("User not found");
    }
    res
      .status(201)
      .json({ msg: "Request submitted successfully.", request: newRequest });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// User: Get all requests for the logged-in user
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await ReturnExchangeRequest.find({ user: req.user.id })
      .populate("user", "firstName lastName email phone")
      .populate("order")
      .populate("product")
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin: Get all return/exchange requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ReturnExchangeRequest.find()
      .populate("user", "firstName lastName email phone")
      .populate("order")
      .populate("product")
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin: Update request status (approve/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value." });
    }
    const request = await ReturnExchangeRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "firstName lastName email")
      .populate("order")
      .populate("product", "name");
    if (!request) {
      return res.status(404).json({ msg: "Request not found." });
    }
    // If approved, update the order status to 'returned'
    if (status === "approved" && request.order) {
      await Order.findByIdAndUpdate(request.order._id, { status: "returned" });
    }
    // Send status update email to user
    const user = request.user;
    const orderObj = request.order;
    const productObj = request.product;
    if (user && user.email) {
      const userName = `${user.firstName} ${user.lastName}`;
      let subject = "Return Request Status Updated - PK Trends";
      let message = `Your return request for order <b>${orderObj.orderId}</b> (Product: ${productObj.name}) has been updated to <b>${status.toUpperCase()}</b>.`;
      if (status === "approved") {
        message += "<br><br>Your order status has been updated to RETURNED.";
      } else if (status === "rejected") {
        message += "<br><br>If you have questions, please contact support.";
      }
      await sendReturnEmail(
        user.email,
        userName,
        orderObj.orderId,
        subject,
        message
      );
    }
    res.json({ msg: "Status updated.", request });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
