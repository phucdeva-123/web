const mongoose = require("mongoose");
const tour = require("./tourModels");
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    Tour: {
      type: mongoose.Schema.ObjectId(),
      ref: "tour",
      required: [true, "Review must belong to a tour."],
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const review = mongoose.model("review", reviewSchema);
module.exports = review;
