const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const password = 'ex7Rkou7aKn4CUPu';
const uri = "mongodb+srv://truelancer:ex7Rkou7aKn4CUPu@cluster0.ow7smv1.mongodb.net/truelancer?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  // to READ;
// ====================================
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
});



// =============  Mongo DB  ==================;


client.connect(err => {
  const infoCollection = client.db("truelancer").collection("trueDB");
  // perform actions on the collection object
  
  // ===========================  inserting data  ======================
  app.post('/addInfo', (req, res) =>{
    const info = req.body;
    infoCollection.insertOne(info)  // Inserting (sending) to the Database;
    .then(result =>{
      res.redirect('/');
    })
  })
  // ===========================  reading data  ======================
  app.get('/infos', (req, res) =>{
    infoCollection.find({})  // Reading (collecting) from the Database;
    .toArray( (err, documents) =>{
        res.send(documents)
    })
  })
  // ===========================  updating data  ======================
  app.get('/singleInfo/:id', (req, res) =>{
    infoCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, result) =>{
      res.send(result[0])
    })
  })
  app.patch('/update/:id', (req, res) =>{
    infoCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {name: req.body.name, friend: req.body.friend}
    }
    )
    .then(result =>{
      res.send(result.modifiedCount > 0)
    })
  })
  
  // ===========================  deleting data  ======================
  app.delete('/delete/:id', (req, res) =>{
    infoCollection.deleteOne({_id: ObjectId(req.params.id)})  // deleting from Database;
    .then( (result) =>{
      res.send(result.deletedCount > 0)
    })
  })
  
  
  // client.close();
});

// ===============================;

app.listen(3000);