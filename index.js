const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    // console.log("root working!!! ");
    res.send("Hello! I am root!!");
})

app.listen(port, () => {
    // console.log(`listening port on ${port}`);
});