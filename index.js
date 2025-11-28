const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const MONGO_CLIENT = new MongoClient(process.env.URL_CONNECTION);

const DATABASE_NAME = "dndmapinfo";
const COLLECTION_WORLD_DB_NAME = "worlds";

(async () => {
  try {
    await MONGO_CLIENT.connect();
    app.locals.db = MONGO_CLIENT.db(DATABASE_NAME);
    app.listen(3000);
    console.log("Server start.");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", async (req, res) => {
  res.json("Welcom to node-mongo server.");
});

app.get("/api/worlds", async (req, res) => {
  console.log("Server GET /api/worlds/");
  try {
    const data = await getData(getCollection(req, COLLECTION_WORLD_DB_NAME));
    console.log("Status code: 200");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/character/:project", async (req, res) => {
  const project = req.params.project;
  console.log(`Server GET /api/character/:${project}`);
  try {
    const data = await getData(getCollection(req, `${project}-character`));
    console.log("Status code: 200");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/mapObject/:project", async (req, res) => {
  const project = req.params.project;
  console.log(`Server GET /api/mapObject/:${project}`);
  try {
    const data = await getData(getCollection(req, `${project}-map-object`));
    console.log("Status code: 200");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/subPage/:project", async (req, res) => {
  const project = req.params.project;
  console.log(`Server GET /api/subPage/:${project}`);
  try {
    const data = await getData(getCollection(req, `${project}-sub-page`));
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/items/:project", async (req, res) => {
  const project = req.params.project;
  console.log(`Server GET /api/items/:${project}`);
  try {
    const data = await getData(getCollection(req, `${project}-items`));
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

process.on("SIGINT", async () => {
  await MONGO_CLIENT.close();
  console.log("Server stop.");
  process.exit();
});

function getCollection(req, collectionName) {
  return req.app.locals.db.collection(collectionName);
}

async function getData(collection) {
  return await collection.find({}).toArray();
}
