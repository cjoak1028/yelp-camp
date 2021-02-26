const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

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

const sample = array => array[Math.floor(Math.random() * array.length)]; 

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6036649fdab03305f7e3b7c9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dqvrdpl6s/image/upload/v1614265853/YelpCamp/kixrv4wfxsv9a21rcbvz.jpg',
                  filename: 'YelpCamp/kixrv4wfxsv9a21rcbvz'
                },
                {
                  url: 'https://res.cloudinary.com/dqvrdpl6s/image/upload/v1614265856/YelpCamp/psxjmb5bkx3ljvdh7hpw.jpg',
                  filename: 'YelpCamp/psxjmb5bkx3ljvdh7hpw'
                },
                {
                  url: 'https://res.cloudinary.com/dqvrdpl6s/image/upload/v1614265858/YelpCamp/rf8mf1y7zi3cc6ypl9te.jpg',
                  filename: 'YelpCamp/rf8mf1y7zi3cc6ypl9te'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})