//Yelpcamp. Github Directory below
//https://github.com/Colt/YelpCamp
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const port = 3000;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

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