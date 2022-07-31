const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());


// console.log(process.env);
// db uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wy12b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const database = client.db('yamashiro-hot-spring');
    const serviceCollection = database.collection('services');
    const foodCollection = database.collection('foods');
    const bookingCollection = database.collection('bookings');
    const carousalCollection = database.collection('carousalImages');

    //GET all services API
    app.get('/services', async (req, res) => {
      console.log('getting services');
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET all foods API
    app.get('/foods', async (req, res) => {
      console.log('getting foods');
      const cursor = foodCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });

    //Get carousal api
    app.get('/carousals', async(req, res)=>{
      console.log('getting carousals');
      const carousalName = req.query.imgfor;
      console.log(carousalName);
      const query = {imgfor: carousalName};
      
      const cursor = carousalCollection.find(query);
      const carousals = await cursor.toArray();
      res.send(carousals);
    })

    //POST API add new Service to db
    app.post('/services', async (req, res) => {

      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      console.log(newService);
      res.send(result);
    });

    //POST API add new Food to db
    app.post('/foods', async (req, res) => {
      const newFood = req.body;
      // const result = await foodCollection.insertOne(newFood);
      console.log(newFood);
      // res.send(result);
    });

    //POST API add new Carousal to db
    app.post('/carousals', async (req, res) => {
      // console.log('hitting carousal api');
      const newImage = req.body;
      // console.log(req.body);
      const result = await carousalCollection.insertOne(newImage);
      res.send(result);
    })

    //Find a Food item API
    app.get('/updatefood/:foodid', async (req, res) => {
      console.log(req.params.foodid);
      const query = { _id: ObjectId(req.params.foodid) };
      console.log(query);
      const result = await foodCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //Find a service API
    app.get('/updateservice/:serviceid', async (req, res) => {
      console.log('hitting update service');
      console.log(req.params.serviceid);
      const query = { _id: ObjectId(req.params.serviceid) };
      console.log(query);
      const result = await serviceCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // get a service api for client
    app.get('/services/:serviceid', async (req, res) => {
      console.log('getting a service');
      console.log(req.params.serviceid);
      const query = { _id: ObjectId(req.params.serviceid) };
      console.log(query);
      const result = await serviceCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //Get user booking api for a specific user
    app.get('/userbooking', async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };
      const cursor = bookingCollection.find(query);
      const userBookings = await cursor.toArray();
      res.send(userBookings);
    })


    //Post booking from client
    app.post('/booking', async (req, res) => {
      console.log('client booking in progress');
      const newBooking = req.body;
      console.log(newBooking);
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
      // console.log(result);
    });

    //get all booking of a service API
    app.get('/booking', async (req, res) => {
      const serviceName = req.query.service;
      const query = { serviceName: serviceName };
      const cursor = bookingCollection.find(query);
      const serviceBookings = await cursor.toArray();
      res.send(serviceBookings);
    })


    //Update a Food item API
    app.put('/updatefood/:foodid', async (req, res) => {

      const query = { _id: ObjectId(req.params.foodid) };
      const updateItem = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: updateItem
      };
      // console.log(updateItem);
      const result = await foodCollection.updateOne(query, updateDoc, options);
      res.send(result);


    });
    //Update a Service API
    app.put('/updateservice/:serviceid', async (req, res) => {

      const query = { _id: ObjectId(req.params.serviceid) };
      const updateItem = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: updateItem
      };
      // console.log(updateItem);
      const result = await serviceCollection.updateOne(query, updateDoc, options);
      res.send(result);


    });

    //Delete a Food item API
    app.delete('/foods/:id', async (req, res) => {
      console.log("proceeding to delete");
      const query = { _id: ObjectId(req.params.id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    });

    //Delete a Service API
    app.delete('/services/:id', async (req, res) => {
      console.log("proceeding to delete");
      const query = { _id: ObjectId(req.params.id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

     //Delete a Booking API
     app.delete('/booking/:id', async (req, res) => {
      console.log("proceeding to delete");
      const query = { _id: ObjectId(req.params.id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})