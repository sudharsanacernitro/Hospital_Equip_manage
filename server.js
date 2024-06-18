const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient,ObjectId } = require('mongodb');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const port=5000;
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379, });
  
    redisClient.connect().catch(console.error);
    app.use(session({
      store: new RedisStore({ client: redisClient }),
      secret: 'eren139', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
      }
    }));
  

const uri = 'mongodb://0.0.0.0:27017';
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  let db;
  

  client.connect()
    .then(() => {
      db = client.db('academics');
      console.log('Connected successfully to MongoDB');
      app.listen(port, () => {
        console.log(`App is running on port ${port}`);
      });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
  

    app.use((req, res, next) => {
        if (req.url === '/login') {
          next();
        } else {
          if (req.session.data) {
            console.log('Session data:', req.session.data);
            next();
            console.log('Requested URL:', req.url);
          } else {
            res.status(403).json({ err: true });
          }
        }
      });
      



      app.post('/login', async (req, res) => {
        const data = req.body;
        try {
          const collection = db.collection('login');
          const result = await collection.find(data).toArray();
          if (result.length > 0) {
            req.session.data = { name: data.name };
            console.log('Session data set:', req.session.data);
            res.status(200).json({ valid: true });
          } else {
            res.status(401).json({ valid: false });
          }
        } catch (error) {
          console.error('Error during login:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


app.get('/main', async (req, res) => {
    try {
        const collection = db.collection('equipment');
        const cursor = collection.find();
        // Convert cursor to array of documents
        const result = await cursor.toArray();

        // Respond with the fetched documents
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});


app.get('/models/:id',async(req,res)=>{
    const make=req.params.id;
    try {
        const collection = db.collection('equipment');
        const cursor = collection.find({make:make});

        // Convert cursor to array of documents
        const result = await cursor.toArray();
        console.log(result);
        
        // Respond with the fetched documents
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});




app.post('/submit',(req,res)=>{
    console.log(req.body);
    try{

        const collection=db.collection("equip_det");
        const result=collection.insertOne(req.body);
        if(result)
            {
                console.log(result._id);
            }
    }
    catch(error)
    {
        console.error(error);
    }
});
app.get('/profile', async (req, res) => {
    try {
        const collection = db.collection('equip_det');
        const result = await collection.find().project({ hospitalName: 1, equipmentMake: 1, equipmentModel: 1, equipmentName: 1 }).toArray();
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/del/:id",async(req,res) => {
    const id=req.params.id;
    try{

        const collection=db.collection('equip_det');
        const result=collection.deleteOne({_id: new ObjectId(id)});

        if(result)
            {
                res.status(200).json({del:true});
            }
    }
    catch(error)
    {
        console.error(error);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to destroy session');
      }
      res.clearCookie('sessionId'); // Clears the cookie
      res.status(200).send('Session destroyed');
    });
  });
/*
db.equipment.insertMany([
    {
        "make": "GE Healthcare",
        "model": ["Optima MR450w","Discovery XR656"]
    },
    {
        "make": "Siemens Healthineers",
        "model": ["Acuson X700","Axion X7010"]
    },
    {
        "make": "Philips",
        "model": ["Ingenuity","MRI-scanner"]
    },
 
    {
        "make": "Olympus",
        "model": ["EVIS EXERA III"]
    }
]);


*/