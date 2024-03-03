const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        type: String,
        default: "https://wallpaperaccess.com/full/223267.jpg",
        set: (v) => v === "" ? "https://wallpaperaccess.com/full/223267.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;