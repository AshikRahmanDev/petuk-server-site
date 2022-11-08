const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://adminUser1:xHk2A9FrOW81uuR0@cluster0.sqgzvsr.mongodb.net/test";
const client = new MongoClient(uri);
const mealsCollection = client.db("petuk").collection("meals");
// xHk2A9FrOW81uuR0

async function run() {
  try {
    app.post("/addMeal", async (req, res) => {
      const meal = req.body;

      const result = await mealsCollection.insertOne(meal);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("petuk server is running");
});

app.listen(port, () => {
  console.log("server running on port", port);
});
