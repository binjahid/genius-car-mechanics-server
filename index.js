const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//userName :GeniusCarMechanics
//Password : AQmroHErs34HnVjy

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mdbb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const serviceCollecion = database.collection("serviceCollection");
    console.log("i am connected to the mongo server");
    // GET ALL USER API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollecion.find({});
      if ((await cursor.count()) === 0) {
        console.log("No Services found!");
      }
      const result = await cursor.toArray();
      res.send(result);
    });
    // GET SINGLE USE API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const serviceId = { _id: ObjectId(id) };
      const query = serviceId;
      const result = await serviceCollecion.findOne(query);
      console.log(result);
      res.json(result);
    });
    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollecion.insertOne(service);
      res.json(result);
    });
    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await serviceCollecion.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running genius server");
});
app.listen(port, () => {
  console.log("listening from port ", port);
});
