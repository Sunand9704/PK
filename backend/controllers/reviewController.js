const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Add a review to a product
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user.id;
    // Compose userName from firstName + lastName, fallback to email or username
    let userName =
      (req.user.firstName && req.user.lastName
        ? req.user.firstName + " " + req.user.lastName
        : req.user.firstName || req.user.lastName) ||
      req.user.username ||
      req.user.email ||
      "Anonymous";

    // Validate input
    if (!productId || !rating || !review) {
      return res.status(400).json({
        msg: "Product ID, rating, and review are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        msg: "Rating must be between 1 and 5",
      });
    }

    if (review.length > 500) {
      return res.status(400).json({
        msg: "Review must be 500 characters or less",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        msg: "You have already reviewed this product",
      });
    }

    // Create the review
    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      review,
    });

    await newReview.save();

    // Add review to product's reviewIds array
    await Product.findByIdAndUpdate(productId, {
      $push: { reviewIds: newReview._id },
    });

    // Update product's average rating and review count
    const allReviews = await Review.find({ productId });
    const avgRating =
      allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      reviews: allReviews.length,
    });

    res.status(201).json({
      msg: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's review for a product
// @route   GET /api/reviews/:productId/user
// @access  Private
exports.getUserReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ productId, userId });

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.json({ review });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a review
// @route   PATCH /api/reviews/:reviewId
// @access  Private (only review owner)
exports.editReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ msg: "Review not found" });
    }
    if (existingReview.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this review" });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }
    if (review && review.length > 500) {
      return res
        .status(400)
        .json({ msg: "Review must be 500 characters or less" });
    }
    if (rating !== undefined) existingReview.rating = rating;
    if (review !== undefined) existingReview.review = review;
    await existingReview.save();

    // Update product's average rating and review count
    const allReviews = await Review.find({
      productId: existingReview.productId,
    });
    const avgRating =
      allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(existingReview.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length,
    });

    res.json({ msg: "Review updated successfully", review: existingReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (only review owner)
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this review" });
    }
    const productId = review.productId;
    await review.deleteOne();
    // Remove review from product's reviewIds array
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviewIds: reviewId },
    });
    // Update product's average rating and review count
    const allReviews = await Review.find({ productId });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) /
          allReviews.length
        : 0;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length,
    });
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
