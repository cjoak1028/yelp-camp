const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// REVIEW ROUTE
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE ROUTE FOR REVIEW
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;