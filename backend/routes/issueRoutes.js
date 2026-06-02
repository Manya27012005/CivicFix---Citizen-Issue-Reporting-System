const express = require("express");
const Issue = require("../models/Issue");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

router.post("/", protect, async (req, res) => {
  const { title, description, category, imageUrl, location } = req.body;
  const address = location?.address?.trim();

  if (!title || !description || !category || !address) {
    return res.status(400).json({
      message: "Title, description, category, and address are required",
    });
  }

  const duplicateIssue = await Issue.findOne({
    category,
    "location.address": {
      $regex: `^${escapeRegex(address)}$`,
      $options: "i",
    },
    status: { $ne: "Resolved" },
  });

  if (duplicateIssue) {
    return res.status(409).json({
      message: "Similar active issue already exists. Please support the existing issue instead.",
      existingIssueId: duplicateIssue._id,
    });
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    imageUrl,
    location: {
      ...location,
      address,
    },
    upvotes: 0,
    priorityScore: 0,
    reportedBy: req.user.id,
    supportedBy: [],
    comments: [],
    feedbacks: [],
  });

  res.status(201).json(issue);
});

router.get("/", async (req, res) => {
  const issues = await Issue.find()
    .populate("reportedBy", "name email")
    .populate("comments.commentedBy", "name email")
    .populate("feedbacks.givenBy", "name email")
    .sort({ priorityScore: -1, createdAt: -1 });

  res.json(issues);
});

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const { status, adminNote } = req.body;

  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  const oldStatus = issue.status;
  const oldAdminNote = issue.adminNote || "";

  issue.status = status || issue.status;
  issue.adminNote = adminNote ?? issue.adminNote;

  await issue.save();

  const statusChanged = oldStatus !== issue.status;
  const noteChanged = oldAdminNote !== (issue.adminNote || "");

  if (issue.reportedBy && (statusChanged || noteChanged)) {
    const notificationType =
      issue.status === "Resolved" ? "ISSUE_RESOLVED" : "STATUS_UPDATE";

    await Notification.create({
      user: issue.reportedBy,
      issue: issue._id,
      type: noteChanged ? "ADMIN_RESPONSE" : notificationType,
      title: `Update on ${issue.title}`,
      message: `Status: ${issue.status}. ${issue.adminNote || "Admin has updated your issue."}`,
    });
  }

  res.json(issue);
});

router.patch("/:id/upvote", protect, async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  const supportedBy = issue.supportedBy || [];
  const alreadySupported = supportedBy.some(
    (userId) => userId.toString() === req.user.id
  );

  if (alreadySupported) {
    return res.status(400).json({ message: "You already supported this issue" });
  }

  const currentUpvotes = Math.max(issue.upvotes || 0, supportedBy.length);

  issue.supportedBy.push(req.user.id);
  issue.upvotes = currentUpvotes + 1;
  issue.priorityScore = issue.upvotes * 10;

  await issue.save();

  res.json(issue);
});

router.post("/:id/comments", protect, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  issue.comments.push({
    text,
    commentedBy: req.user.id,
  });

  await issue.save();

  const updatedIssue = await Issue.findById(req.params.id)
    .populate("reportedBy", "name email")
    .populate("comments.commentedBy", "name email")
    .populate("feedbacks.givenBy", "name email");

  res.status(201).json(updatedIssue);
});

router.post("/:id/feedback", protect, async (req, res) => {
  const { rating, comment } = req.body;

  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  if (issue.status !== "Resolved") {
    return res.status(400).json({
      message: "Feedback can be added only after issue is resolved",
    });
  }

  const alreadyGivenFeedback = issue.feedbacks.some(
    (feedback) => feedback.givenBy.toString() === req.user.id
  );

  if (alreadyGivenFeedback) {
    return res.status(400).json({ message: "You already gave feedback" });
  }

  issue.feedbacks.push({
    rating,
    comment,
    givenBy: req.user.id,
  });

  await issue.save();

  const updatedIssue = await Issue.findById(req.params.id)
    .populate("reportedBy", "name email")
    .populate("comments.commentedBy", "name email")
    .populate("feedbacks.givenBy", "name email");

  res.status(201).json(updatedIssue);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  await Notification.deleteMany({ issue: req.params.id });
  res.json({ message: "Issue deleted successfully" });
});

module.exports = router;
