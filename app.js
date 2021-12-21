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
const { campgroundSchema } = require('./schemas')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

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
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));
//render new campground and display it afterwards
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campgrounds);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

//navigate to edit 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))
//put changes to specific campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/campgrounds/${campground._id}`)
}));
//delete campground 
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all("*", (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something Went Wrong';
    res.status(statusCode).render("error", { err });
})


app.listen(port, () => {
    console.log(`Serving on localhost:${port}`)
})