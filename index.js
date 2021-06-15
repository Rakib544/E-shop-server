const express = require('express');
const cors = require('cors')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acxxo.mongodb.net/eShop?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello Programmers! I am now currently working on my e-shop projects')
})

client.connect(err => {
    const productsCollection = client.db("eShop").collection("products");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        
        productsCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
            .catch(error => {
                console.log(error)
            })
    })

    app.get('/allProducts', (req, res) => {
        productsCollection.find({})
        .toArray((err, products) => {
            res.send(products)
        })
    })

    app.get('/findSingleProduct/:id', (req, res) => {
        const id=req.params.id;
        productsCollection.findOne({_id: ObjectId(`${id}`)})
        .then(result => {
            res.send(result)
        })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/allOrderList', (req, res) => {
        orderCollection.find({})
        .toArray((err, orders) => {
            res.send(orders)
        })
    })

    app.get('/usersOrders/:email', (req, res) => {
        const email = req.params.email;
        orderCollection.find({userEmail: `${email}`})
        .toArray((err, orders) => {
            res.send(orders)
        })
    })

    app.patch('/update', (req, res) => {
        orderCollection.updateOne({_id: ObjectId(`${req.body.id}`)}, {
            $set: {orderStatus: req.body.statusValue}
        })
        .then(result => {
            res.send(result)
        })
    })

    app.delete('/delete', (req, res) => {
        serviceCollection.deleteOne({_id: ObjectId(`${req.body.id}`)})
        .then(result => {
            res.send(result.deletedCount > 0)
            console.log(result.deletedCount)
        })
    })
   
});

app.listen(process.env.PORT || 8080);
