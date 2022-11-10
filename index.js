const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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

const jwtAuth = (req, res, next) => {
  const clientToken = req.headers.authorization;
  if (!clientToken) {
    return res.status(403).send("unauthorize access!");
  }
  jwt.verify(clientToken, process.env.JWT_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send("unauthorize access!");
    }
    req.decoded = decoded;
  });
  next();
};

async function run() {
  try {
    // jwt token api
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: "2h" });
      res.send({ token });
    });

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

    // get user reviews form review collection
    app.get("/reviews", async (req, res) => {
      const meal = req.headers.meal;
      const query = {
        meal: meal,
      };
      const cursor = reviewCollection.find(query).sort({ _id: -1 });
      const result = await cursor.toArray();
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

    // get user review with email
    app.get("/user/reviews", jwtAuth, async (req, res) => {
      const email = req.query.email;
      if (req.decoded?.email !== email) {
        return res.status(401).send({ Access: "unauthorize Access" });
      }
      const query = { email: email };
      const cursor = reviewCollection.find(query).sort({ _id: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete user review
    app.delete("/delete/review", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
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
