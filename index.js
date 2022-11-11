const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f1hhq8d.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection=client.db('travelguide').collection('services');
        const reviwesCollection=client.db('travelguide').collection('reviews');


        app.get('/services',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query);
            const services =await cursor.limit(3).toArray();
            res.send(services)
        })
        app.get('/servicesall',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query);
            const services =await cursor.toArray();
            res.send(services)
        })
       

        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)}
            const service=await serviceCollection.findOne(query);
            res.send(service)
        })

        // reviews api

        app.get('/reviews',async(req,res)=>{
            let query={};

            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor=reviwesCollection.find(query);
            const rewiews =await cursor.toArray();
            res.send(rewiews)
        })

        app.post('/reviews',async(req,res)=>{
            const review=req.body;
            const result = await reviwesCollection.insertOne(review);
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('travel server is running')
})

app.listen(port, () => {
    console.log(`travel server is running on ${port}`)
})
