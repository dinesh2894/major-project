const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {engine} = require("express/lib/application");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review");

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

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new", (req, res) => {
    console.log("new route");
    res.render("listings/new.ejs");
});

// Show Routes
app.get("/listings/:id",
    wrapAsync(async (req, res) => {
        console.log("show route");
        let {id} = req.params;
        const listing = await Listing.findById(id);
        // const allListings = await Listing.find({});
        res.render("listings/show.ejs", {listing});
    })
);

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
        let {id} = req.params;
        console.log(id);
        const listing = await Listing.findById(id);
        console.log(listing);
        res.render("listings/edit.ejs", {listing});
    })
);

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
app.delete("/listings/:id",
    wrapAsync(async (req, res) => {
        let {id} = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
        console.log(deleteListing);
        res.redirect('/listings');
    })
);

// Reviews
// Post route
app.post("/listings/:id/reviews", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
})

// app.get("/test-listing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });


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