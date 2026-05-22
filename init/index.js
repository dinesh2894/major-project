const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = `mongodb://dk13722biet:Spider9772140103@ac-fswvm6w-shard-00-00.hlhf5fz.mongodb.net:27017,ac-fswvm6w-shard-00-01.hlhf5fz.mongodb.net:27017,ac-fswvm6w-shard-00-02.hlhf5fz.mongodb.net:27017/?ssl=true&replicaSet=atlas-8vuhco-shard-0&authSource=admin&appName=Cluster0`;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log();
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();