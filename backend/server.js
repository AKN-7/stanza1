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

mongoose.connect(process.env.MONGODB_URI, {
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
  try {
    const poem = new Poem(req.body);
    await poem.save();
    res.status(201).send(poem);
  } catch (error) {
    console.error('Error saving poem:', error);
    res.status(500).send({ message: 'Error saving poem' });
  }
});

app.get('/poems', async (req, res) => {
  try {
    const poems = await Poem.find().sort({ likes: -1, date: -1 });
    res.send(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    res.status(500).send({ message: 'Error fetching poems' });
  }
});

app.post('/poems/:id/like', async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    poem.likes += 1;
    await poem.save();
    res.send(poem);
  } catch (error) {
    console.error('Error liking poem:', error);
    res.status(500).send({ message: 'Error liking poem' });
  }
});

app.delete('/poems', async (req, res) => {
  try {
    await Poem.deleteMany({});
    res.status(200).send({ message: 'All poems cleared' });
  } catch (error) {
    console.error('Error clearing poems:', error);
    res.status(500).send({ message: 'Error clearing poems' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
