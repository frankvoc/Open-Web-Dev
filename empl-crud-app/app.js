const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
require('./helpers');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//hbs setup
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

//routiing
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/employees', employeeRoutes);

//mongodb connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});