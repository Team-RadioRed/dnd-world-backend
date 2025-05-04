const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.URL_CONNECTION);

(async () => {
  try {
    await mongoClient.connect();
    app.locals.db = mongoClient.db("dndmapinfo");
    app.listen(3000);
    console.log("Server start.");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", async (req, res) => {
  res.json("Welcom to node-mongo server.");
});

app.get("/api/character", async (req, res) => {
  console.log("Server GET /api/character/");
  const collection = req.app.locals.db.collection("sailpunkCharacter");

  try {
    const characters = await collection.find({}).toArray();
    console.log("Status code: 200");
    res.send(characters);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/api/mapObject", async (req, res) => {
  console.log("Server GET /api/mapObject/");
  const collection = req.app.locals.db.collection("sailpunkMapObject");

  try {
    const mapObject = await collection.find({}).toArray();
    console.log("Status code: 200");
    res.send(mapObject);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/api/subPage", async (req, res) => {
  console.log("Server GET /api/subPage");
  const collection = req.app.locals.db.collection("sailpunkSubPage");

  try {
    const subPages = await collection.find({}).toArray();
    console.log("Status code: 200");
    res.send(subPages);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

process.on("SIGINT", async () => {
  await mongoClient.close();
  console.log("Server stop.");
  process.exit();
});
