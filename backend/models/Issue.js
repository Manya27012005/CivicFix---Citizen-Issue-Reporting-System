const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: String,
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    imageUrl: String,
    location: {
      address: String,
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["Reported", "Verified", "In Progress", "Resolved"],
      default: "Reported",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    adminNote: String,
    comments: [commentSchema],
    feedbacks: [feedbackSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
