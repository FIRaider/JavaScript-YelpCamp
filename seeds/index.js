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
        const price = Math.floor(Math.random() * 50) + 50;
        const newCampground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, aspernatur sapiente iusto tempore ea in aut molestias dolore illum provident reiciendis neque sit accusamus. Asperiores sint exercitationem adipisci voluptate! Ducimus?Sunt corporis porro cum, voluptatum est ratione voluptas amet! Corporis commodi inventore ducimus accusantium possimus? Ad quasi quos ducimus natus commodi nobis qui quidem odio magnam perferendis dolorum, explicabo rerum!',
            price,
        });
        await newCampground.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});