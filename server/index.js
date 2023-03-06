import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json())
const port = 3000;

const url = "mongodb+srv://user:pass@cluster0.bkukpgk.mongodb.net/test";
const client = new MongoClient(url);

await client.connect();
const db = client.db("Zillow");
const collection = db.collection("comments");

function replaceZpid(zpid) {
    if (zpid.endsWith('_zpid')) {
        zpid = zpid.replace('_zpid', '');
    }
    return zpid;
}

app.get("/:zpid", async (req, res) => {
    let replacedZpid = replaceZpid(req.params.zpid);
    const doc = await collection.findOne({ zpid: replacedZpid })
    res.send(doc || { comments: [] });
});

app.post("/:zpid/comment", async (req, res) => {
    let zpid = replaceZpid(req.params.zpid);
    if (!req.body.comment) res.sendStatus(400);
    const doc = await collection.findOne({ zpid })
    if (!doc) {
        await collection.insertOne({ zpid, comments: [req.body.comment.substring(0, 160)] })
    } else {
        collection.updateOne(
            { zpid },
            { $push: { comments: req.body.comment.substring(0, 160) } }
        )
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
