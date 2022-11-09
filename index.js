const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://adminUser1:xHk2A9FrOW81uuR0@cluster0.sqgzvsr.mongodb.net/test";
const client = new MongoClient(uri);
const mealsCollection = client.db("petuk").collection("meals");
const reviewCollection = client.db("petuk").collection("reviews");
// xHk2A9FrOW81uuR0

async function run() {
  try {
    // add meal data in mongodb
    app.post("/addMeal", async (req, res) => {
      const meal = req.body;
      const result = await mealsCollection.insertOne(meal);
      res.send(result);
    });

    // add review in mongodb
    app.post("/add/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // get meals limited collection from mongodb
    app.get("/home/meals", async (req, res) => {
      const query = {};
      const cursor = mealsCollection.find(query);
      const result = await cursor.limit(3).toArray();
      res.send(result);
    });

    // get meals collection form mongodb
    app.get("/menu/meals", async (req, res) => {
      const query = {};
      const cursor = mealsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single meal with id
    app.get("/mealWithId/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await mealsCollection.findOne(query);
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
