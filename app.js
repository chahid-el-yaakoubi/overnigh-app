// Import required packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

// Import models and middleware
const MydataCustemer = require('./models/myDataSchema');
const isAuthenticated = require('./router/authMiddleware');

// Database Connection
// const pass = "T2dI5Ka525xaJgUo";
// const conx = `mongodb+srv://dev1234:${pass}@cluster0.xj4k9.mongodb.net/all-data?retryWrites=true&w=majority`;

// Set up LiveReload for development
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

app.use(connectLivereload());
liveReloadServer.server.once('connection', () => {
  setTimeout(() => liveReloadServer.refresh('/'), 100);
});

// Redirect to login page as the root route
app.get('/', (req, res) => {
  res.redirect('login.html');
});

// Render login page with document count
app.get('/login.html', (req, res) => {
  res.render('login'); // تأكد من أن هذا يتطابق مع اسم ملف EJS الخاص بك
});



// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());

// Configure express-session with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'dssssssssssssssssssfdsfsdfdsfsddsddfsffdsfsdfsd',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || conx,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}));

// Login route to authenticate user
app.post('/login.html', async (req, res) => {
  try {
    const { Email, password } = req.body;

    if (!Email || !password) {
      return res.status(400).send('Please enter both email and password.');
    }

    const customer = await MydataCustemer.findOne({ Email });
    if (!customer) {
      return res.status(400).send('Invalid credentials.');
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      return res.status(400).send('Invalid credentials.');
    }

    req.session.userId = customer._id; // Save customer ID to session
    res.redirect('/hoooommme.html');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

// Logout route to destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/login.html');
  });
});

// Import and use route modules
const allRouter = require('./router/allrouter');
const routerAddUser = require('./router/addUser');
const routerAddHouse = require('./router/addhouse');
const routerimgHouse = require('./router/imgHouse');
const routerAddRealty = require('./router/addRealty');

app.use(routerimgHouse);
app.use(routerAddRealty);
app.use(routerAddHouse);
app.use(routerAddUser);
app.use(allRouter);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI || conx)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
