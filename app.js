const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const methodOverride = require('method-override');
const app = express();
const port = 3001;
const MydataCustemer = require('./models/myDataSchema');

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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.json());
var bcrypt = require('bcrypt'); // Import bcrypt


app.post('/login.html', async (req, res) => {
  try {
    const { Email, password } = req.body; // Destructure email and password from req.body
    // Check if req.body is empty
    if (!req.body) {
      return res.status(400).send('Request body is missing'); // Handle missing body
    }

    // Find the customer by email
    const customer = await MydataCustemer.findOne({ Email });
    
    if (!customer) {
      return res.status(400).send('Invalid credentials'); // Customer not found
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, customer.password);

    if (match) {

      // Passwords match, proceed with login
      res.redirect('/hoooommme.html'); // Redirect to home
    } else {
      res.status(400).send('Invalid credentials'); // Passwords do not match
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});
// Routers
const allRouter = require('./router/allrouter');
const routerAddUser = require('./router/addUser');
const routerAddHouse = require('./router/addhouse'); // Import addhouse router
const routerimgHouse = require('./router/imgHouse');
const routerAddRealty = require('./router/addRealty'); // Import addRealty router

// Use Routes
app.use(routerimgHouse);
app.use(routerAddRealty);  // Add realty data to MongoDB
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
