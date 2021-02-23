const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use(flash());

// Use middleware that parses urlencoded
app.use(express.urlencoded({ extended: true }));

// Override method with query string
app.use(methodOverride('_method'));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for flash message (all requests have access)
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// HOME
app.get('/', (req, res) => {
    res.render('home');
})

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