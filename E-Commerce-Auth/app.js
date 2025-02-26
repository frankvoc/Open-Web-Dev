const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const config = require('./config');

//init our express app
const app = express();

//Mongo connection
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//hbs
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

//routing
app.use('/auth', authRoutes);

//root
app.get('/', (req, res) => {
  res.redirect('/auth/register');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
  });

//start on port 5k
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
