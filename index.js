const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const DATABASE_NAME = "dndmapinfo";
const WORLDS_NAME = ["sailpunk", "aeterna", "umbrae-stellarum"];

const MONGO_CLIENT = new MongoClient(process.env.URL_CONNECTION);

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
    const data = {};

    for (let worldName of WORLDS_NAME) {
      const configData = await getData(getCollection(req, `${worldName}-config`));
      if (configData !== null) {
        data[worldName] = Object.fromEntries(
          configData.map(item => [item.name, item])
        );
      }
    }

    console.log("Status code: 200");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/character/", async (req, res) => {
  const project = req.query.project;
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

app.get("/api/mapObject/", async (req, res) => {
  const project = req.query.project;
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

app.get("/api/subPage/", async (req, res) => {
  const project = req.query.project;
  console.log(`Server GET /api/subPage/:${project}`);
  try {
    const data = await getData(getCollection(req, `${project}-sub-page`));
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/items/", async (req, res) => {
  const project = req.query.project;
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
