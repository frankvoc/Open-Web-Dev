const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Set up Handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a simple schema and model
const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/', async (req, res) => {
  const items = await Item.find();
  res.render('view', { items });
});

app.post('/add', async (req, res) => {
  const newItem = new Item({ name: req.body.name });
  await newItem.save();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
