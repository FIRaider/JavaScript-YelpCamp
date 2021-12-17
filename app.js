//Yelpcamp. Github Directory below
//https://github.com/Colt/YelpCamp
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
//const { stringify } = require('querystring');
const port = 3000;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const engine = require('ejs-mate');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

// main().catch(err => console.log("Undable to connect !", err));
// async function main() {
//     await mongoose.connect('mongodb://localhost:27017/yelp-camp');
//     console.log('Database Connected!')
// }
const app = express();

app.engine('ejs', engine) //uses ejs locals for all ejs templates
app.set('views', path.join(__dirname, 'views')); //so we can keep views in seperate folder
app.set('view engine', 'ejs'); //to use ejs

app.use(express.urlencoded({ extended: true })); //for post requests
app.use(methodOverride('_method')) //so we can use method = put in ejs 


//render home page
app.get('/', (req, res) => {
    res.render('home');
});
//render campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});
//needs to go above /:id otherwise overridden
//page for new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});
//render campgrounds with unique id
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(campground)
    res.render('campgrounds/show', { campground })
});
//render new campground and display it afterwards
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body);
    console.log(req.body.campground, req.body)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

//navigate to edit 
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})
//put changes to specific campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/campgrounds/${campground._id}`)
})
//delete campground 
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})




app.listen(port, () => {
    console.log(`Serving on localhost:${port}`)
})