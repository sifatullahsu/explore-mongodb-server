const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

const username = process.env.username;
const password = process.env.password;
const cluster = process.env.cluster;

// const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});


const run = async () => {
  try {
    const db = client.db('simpleNode');
    const userCollection = db.collection('users');


    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const user = req.body;
      const option = { upsert: true }
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updateUser, option);
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const request = await userCollection.insertOne(user);
      res.send(request);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  }
  finally {

  }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Explore MongoDB Server Running...');
});

app.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}`);
});