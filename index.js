const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const WORLDS_NAME = ["sailpunk", "aeterna", "umbrae-stellarum"];

const MONGO_CLIENT = new MongoClient(process.env.URL_CONNECTION);

(async () => {
  try {
    await MONGO_CLIENT.connect(process.env.DATABASE_NAME);
    app.locals.db = MONGO_CLIENT.db();
    app.listen(process.env.PORT);
    console.log("Server start.");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", async (req, res) => {
  res.json("Welcom to node-mongo server.");
});

app.get("/api/worlds", async (req, res) => {
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

    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/character/", async (req, res) => {
  const project = req.query.project;
  try {
    const data = await getData(getCollection(req, `${project}-character`));
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/mapObject/", async (req, res) => {
  const project = req.query.project;
  try {
    const data = await getData(getCollection(req, `${project}-map-object`));
    res.send(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/items/", async (req, res) => {
  const project = req.query.project;
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
