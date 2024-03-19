const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;

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

const DATABASE = "wanderlust";
const MONGO_URL = `mongodb://127.0.0.1:27017/${DATABASE}`;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// root
app.get("/", (req, res) => {
    res.send("Hello! I am root!!");
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!!"} = err;
    // res.send("Something went wrong!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

//-- Server 
app.listen(port, () => {
    console.log(`listening port on ${port}`);
});