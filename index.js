const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// midleWare
app.use(cors());
app.use(express.json());

//  .env
// DB_USER=coffeMaster
// DB_PASS=GEODPKdCEwoRAFAj
// process.env.DB_USER

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydmxw3q.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://127.0.0.1:27017";
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
    const coffeDatabase = client.db("coffeDatabaseDB").collection("coffees");
    app.post("/coffee", async (req, res) => {
      const coffeeFromUI = req.body;
      const result = await coffeDatabase.insertOne(coffeeFromUI);

      res.send(result);
    });
    app.get("/coffee", async (req, res) => {
      const cursor = coffeDatabase.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await coffeDatabase.findOne(quary);

      res.send(result);
    });
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const upDateCoffe = req.body;
      console.log(upDateCoffe);
      const coffe = {
        $set: {
          coffeeName: upDateCoffe.coffeeName,
          availableQuantity: upDateCoffe.availableQuantity,
          supplier: upDateCoffe.supplier,
          taste: upDateCoffe.taste,
          category: upDateCoffe.category,
          details: upDateCoffe.details,
          photo: upDateCoffe.photo,
        },
      };
      const result = await coffeDatabase.updateOne(filter, coffe, options);
      res.send(result);
    });
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await coffeDatabase.deleteOne(quary);
      res.send(result);
    });
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
