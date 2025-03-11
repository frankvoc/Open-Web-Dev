const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const config = require('./config');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const listingRoutes = require('./routes/listing');
const bidRoutes = require('./routes/bids');
//init EXPRESS app
const app = express();
//mongo connection
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
//static files  
app.use(express.static('public'));
//setup hbs
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
//the middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
//loading passport config
require('./config/passport')(passport);
//routes
app.use('/auth', authRoutes);
app.use('/listing', listingRoutes);
app.use('/bids', bidRoutes);
//route for root
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});
app.get('/dashboard', async (req, res) => {
    const token = req.cookies.token;
    //error handling if user login is not detected
    if (!token) {
      return res.render('error', { message: 'Please log in to access the dashboard.' });
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.render('error', { message: 'Please log in to access the dashboard.' });
      }
      res.render('dashboard', { username: user.username });
    } catch (err) {
      return res.render('error', { message: 'Please log in to access the dashboard.' });
    }
  });
//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
