const express = require('express');
const cors = require('cors')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
require('dotenv').config();

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjo8u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello I am now working on my yacht service project')
})

client.connect(err => {
    const serviceCollection = client.db("yacht-service").collection("services");
    const reviewCollection = client.db("yacht-service").collection("reviews");
    const adminCollection = client.db("yacht-service").collection("admins");
    const orderCollection = client.db("yacht-service").collection("orders");

    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
            .catch(error => {
                console.log(error)
            })
    })

    app.get('/allServices', (req, res) => {
        serviceCollection.find({})
        .toArray((err, services) => {
            res.send(services)
        })
    })

    app.get('/findSingleService/:id', (req, res) => {
        const id=req.params.id;
        serviceCollection.findOne({_id: ObjectId(`${id}`)})
        .then(result => {
            res.send(result)
        })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/allReviews', (req, res) => {
        reviewCollection.find({})
        .toArray((err, reviews) => {
            res.send(reviews)
        })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/allAdmins', (req, res) => {
        adminCollection.find({})
        .toArray((err, admins) => {
            res.send(admins)
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
