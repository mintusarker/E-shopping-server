const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl1tykd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const productCollection = client.db('eshop').collection('products')


        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log(page, size);
            const query = {};
            const result = await productCollection.find(query).skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, result });
        })

        //search Api
        app.get("/search/:key", async (req, res) => {
            let result = await productCollection.find(
                {
                    "$or": [
                        {
                            category: { $regex: req.params.key }
                        },
                        // {
                        //     name: { $regex: req.params.key }
                        // },
                    ]
                }).toArray();
            res.send(result);
        });

    } finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('e-shopping server running')
})


app.listen(port, () => console.log(`server running on ${port}`))