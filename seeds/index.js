const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Campground = require('../models/campground')
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newCampground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
        });
        await newCampground.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close()
});