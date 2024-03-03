const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log();
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/test-listing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My new villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("successful testing");
});

app.get("/", (req, res) => {
    // console.log("root working!!! ");
    res.send("Hello! I am root!!");
})

app.listen(port, () => {
    console.log(`listening port on ${port}`);
});