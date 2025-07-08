const HeroCarousel = require("../models/HeroCarousel");
const { validationResult } = require("express-validator");

// @desc    Get all active hero carousel slides
// @route   GET /api/hero-carousel
// @access  Public
exports.getActiveSlides = async (req, res, next) => {
  try {
    const slides = await HeroCarousel.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(slides);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hero carousel slides (admin)
// @route   GET /api/admin/hero-carousel
// @access  Private/Admin
exports.getAllSlides = async (req, res, next) => {
  try {
    const slides = await HeroCarousel.find().sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hero carousel slide
// @route   GET /api/admin/hero-carousel/:id
// @access  Private/Admin
exports.getSlideById = async (req, res, next) => {
  try {
    const slide = await HeroCarousel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ msg: "Hero carousel slide not found" });
    }
    res.json(slide);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hero carousel slide
// @route   POST /api/admin/hero-carousel
// @access  Private/Admin
exports.createSlide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const slide = new HeroCarousel(req.body);
    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
};

// @desc    Update hero carousel slide
// @route   PUT /api/admin/hero-carousel/:id
// @access  Private/Admin
exports.updateSlide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const slide = await HeroCarousel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!slide) {
      return res.status(404).json({ msg: "Hero carousel slide not found" });
    }
    res.json(slide);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hero carousel slide
// @route   DELETE /api/admin/hero-carousel/:id
// @access  Private/Admin
exports.deleteSlide = async (req, res, next) => {
  try {
    const slide = await HeroCarousel.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ msg: "Hero carousel slide not found" });
    }
    res.json({ msg: "Hero carousel slide deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle slide active status
// @route   PATCH /api/admin/hero-carousel/:id/toggle
// @access  Private/Admin
exports.toggleSlideStatus = async (req, res, next) => {
  try {
    const slide = await HeroCarousel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ msg: "Hero carousel slide not found" });
    }

    slide.isActive = !slide.isActive;
    await slide.save();

    res.json(slide);
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder slides
// @route   PUT /api/admin/hero-carousel/reorder
// @access  Private/Admin
exports.reorderSlides = async (req, res, next) => {
  try {
    const { slides } = req.body; // Array of { id, order }

    if (!Array.isArray(slides)) {
      return res.status(400).json({ msg: "Slides array is required" });
    }

    // Update each slide's order
    const updatePromises = slides.map(({ id, order }) =>
      HeroCarousel.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    // Return updated slides in order
    const updatedSlides = await HeroCarousel.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.json(updatedSlides);
  } catch (error) {
    next(error);
  }
};
