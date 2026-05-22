const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 5000;

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {engine} = require("express/lib/application");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.route.js");
const reviews = require("./routes/review.route.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const DATABASE = "wanderlust";
// const MONGO_URL = `mongodb://127.0.0.1:27017/${DATABASE}`;
const MONGO_URL = `mongodb://dk13722biet:Spider9772140103@ac-fswvm6w-shard-00-00.hlhf5fz.mongodb.net:27017,ac-fswvm6w-shard-00-01.hlhf5fz.mongodb.net:27017,ac-fswvm6w-shard-00-02.hlhf5fz.mongodb.net:27017/?ssl=true&replicaSet=atlas-8vuhco-shard-0&authSource=admin&appName=Cluster0`;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// root
app.get("/", listings)
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

const pageNotFound = (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
};
app.use("*", pageNotFound);

const somethingWentWrong = (err, req, res) => {
    let {statusCode = 500, message = "Something went wrong!!"} = err;
    // res.send("Something went wrong!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
};

// Error handler
app.use(somethingWentWrong);

//-- Server 
app.listen(port, () => {
    console.log(`listening port on ${port}`);
});