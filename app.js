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

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
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
        let {id} = req.params;
        const listing = await Listing.findById(id);
        // const allListings = await Listing.find({});
        res.render("listings/show.ejs", {listing});
    })
);

// Create Route
app.post("/listings",
    wrapAsync(async (req, res) => {
        if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log(newListing);
        res.redirect("/listings");
    })
);

// Edit Route
app.get("/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
    })
);

// Update Route
app.put("/listings/:id",
    wrapAsync(async (req, res) => {
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
    res.status(statusCode).render("error.ejs",{message});
});

//-- Server 
app.listen(port, () => {
    console.log(`listening port on ${port}`);
});