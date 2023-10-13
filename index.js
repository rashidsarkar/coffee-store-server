const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// midleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydmxw3q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // const coffeDatabaseDB = client.db("coffeDatabaseDB");
    // const coffees = database.collection("coffees");
    app.post("/coffee", async (req, res) => {
      const coffeDatabase = client.db("coffeDatabaseDB").collection("coffees");

      const coffeeFromUI = req.body;
      const result = await coffeDatabase.insertOne(coffeeFromUI);

      res.send(result);
    });
    app.get("/coffee", (req, res) => {});
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffy On Display");
});
app.listen(port, () => {
  console.log(`coffy server is running on ${port}`);
});
