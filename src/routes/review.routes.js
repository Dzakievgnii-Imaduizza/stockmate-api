const express = require("express");
const router = express.Router();

const controller = require("../controllers/review.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, controller.createReview);
router.get("/", protect, controller.getReviewByUser);
router.delete("/:id", protect, controller.deleteReview);
module.exports = router;