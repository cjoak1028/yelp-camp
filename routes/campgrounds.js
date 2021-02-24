const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

// INDEX ROUTE
router.get('/', catchAsync(campgrounds.index));

// NEW ROUTE
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// CREATE ROUTE
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// SHOW ROUTE
router.get('/:id', catchAsync(campgrounds.showCampground));

// EDIT ROUTE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// UPDATE ROUTE
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

// DELETE ROUTE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;