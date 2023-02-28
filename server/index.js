import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 3000;

const url = "mongodb+srv://user:pass@cluster0.bkukpgk.mongodb.net/test";
const client = new MongoClient(url);

await client.connect();
console.log("Connected successfully to server");
const db = client.db("Zillow");
const collection = db.collection("ZillowUpvotes");

function replaceZpid(zpid) {
    if (zpid.endsWith('_zpid')) {
        zpid = zpid.replace('_zpid', '');
    }
    return zpid;
}

app.get("/:zpid", async (req, res) => {
    let zpid = replaceZpid(req.params.zpid);
    const doc = await collection.findOne({ zpid })
    res.send(doc || {});
});

app.post("/:zpid", async (req, res) => {
    let zpid = replaceZpid(req.params.zpid);
    await collection.insertOne({ zpid, tvTooHigh: 0 })
    res.send(200);
});

app.put("/:zpid/increment", async (req, res) => {
    let zpid = replaceZpid(req.params.zpid);
    const doc = await collection.findOne({ zpid })
    if (!doc) {
        await collection.insertOne({ zpid, tvTooHigh: 1 })
    } else {
        await collection.updateOne({ zpid }, { $inc: { tvTooHigh: 1 } });
    }
    const createdDoc = await collection.findOne({ zpid })
    res.send(createdDoc);
});

app.put("/:zpid/decerement", async (req, res) => {
    let zpid = replaceZpid(req.params.zpid);
    const doc = await collection.findOne({ zpid })
    if (!doc) {
        await collection.insertOne({ zpid, tvTooHigh: 1 })
    } else {
        if (doc.tvTooHigh > 0) {
            await collection.updateOne({ zpid }, { $inc: { tvTooHigh: -1 } });
        }
    }
    const createdDoc = await collection.findOne({ zpid })
    res.send(createdDoc);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
