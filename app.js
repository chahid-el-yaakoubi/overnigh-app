const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const port = 3001;
const MydataCustemer = require('./models/myDataSchema');
const isAuthenticated = require('./router/authMiddleware');

// Database Connection
const pass = "T2dI5Ka525xaJgUo";
const conx = `mongodb+srv://dev1234:${pass}@cluster0.xj4k9.mongodb.net/all-data?retryWrites=true&w=majority`;

// Set up LiveReload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

app.use(connectLivereload());
liveReloadServer.server.once('connection', () => {
  setTimeout(() => liveReloadServer.refresh('/'), 100);
});

app.get('/', (req, res) => {
  res.redirect('login.html');
});

app.get('/login.html', async (req, res) => {
  try {
    const countA = await MydataCustemer.countDocuments({});
    res.render('login', { countA: countA });
  } catch (err) {
    console.error('Error counting documents:', err);
    res.status(500).send('Error retrieving counts');
  }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());


// Configure express-session
app.use(session({
  secret: 'dsqfbhdsbfndsfqdfqklhfdsqnlklkqdfjklqjfklqdfjl', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const bcrypt = require('bcrypt');

app.post('/login.html', async (req, res) => {
  try {
    const { Email, password } = req.body;

    if (!req.body) {
      return res.status(400).send('Request body is missing');
    }

    const customer = await MydataCustemer.findOne({ Email });

    if (!customer) {
      return res.status(400).send('Invalid credentials');
    }

    const match = await bcrypt.compare(password, customer.password);

    if (match) {
      req.session.userId = customer._id; // Save customer ID to session
      res.redirect('/hoooommme.html');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});



app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/login.html');
  });
});

// Routers
const allRouter = require('./router/allrouter');
const routerAddUser = require('./router/addUser');
const routerAddHouse = require('./router/addhouse');
const routerimgHouse = require('./router/imgHouse');
const routerAddRealty = require('./router/addRealty');

// Use Routes
app.use(routerimgHouse);
app.use(routerAddRealty);
app.use(routerAddHouse);
app.use(routerAddUser);
app.use(allRouter);

// Connect to MongoDB and Start the Server
mongoose
  .connect(process.env.MONGODB_URI || conx)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch(err => console.error(err));
