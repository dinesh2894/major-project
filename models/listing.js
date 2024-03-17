const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DEFAULT_IMAGE_URL = "https://wallpaperaccess.com/full/223267.jpg";

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        type: String,
        default: DEFAULT_IMAGE_URL,
        set: (v) => v === "" ? DEFAULT_IMAGE_URL : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async () => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;