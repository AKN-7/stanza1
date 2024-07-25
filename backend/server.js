const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Adjust this to the specific origin of your frontend if needed
  methods: ['GET', 'POST', 'DELETE'],
}));

// Use the MongoDB URI from the environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stanza';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const poemSchema = new mongoose.Schema({
  stanzaType: String,
  content: String,
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

const Poem = mongoose.model('Poem', poemSchema);

app.post('/poems', async (req, res) => {
  const poem = new Poem(req.body);
  await poem.save();
  res.status(201).send(poem);
});

app.get('/poems', async (req, res) => {
  const poems = await Poem.find().sort({ likes: -1, date: -1 });
  console.log('Fetched poems:', poems); // Add this line
  res.send(poems);
});

app.post('/poems/:id/like', async (req, res) => {
  const poem = await Poem.findById(req.params.id);
  poem.likes += 1;
  await poem.save();
  res.send(poem);
});

app.delete('/poems', async (req, res) => {
  await Poem.deleteMany({});
  res.status(200).send({ message: 'All poems cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
