const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

// Change ejs engine
app.engine('ejs', ejsMate);
// Set view as ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use middleware that parses urlencoded
app.use(express.urlencoded({ extended: true }));

// Override method with query string
app.use(methodOverride('_method'));

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/campgrounds', campgrounds);

// HOME
app.get('/', (req, res) => {
    res.render('home');
})

// REVIEW ROUTE
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE ROUTE FOR REVIEW
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err; 
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('LISTENING TO PORT 3000')
})