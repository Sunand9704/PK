const mongoose = require("mongoose");

const heroCarouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    customContent: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Image URL is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
      trim: true,
    },
    linkText: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for ordering
heroCarouselSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model("HeroCarousel", heroCarouselSchema);
