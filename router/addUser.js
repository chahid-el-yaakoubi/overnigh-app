var express = require('express');
var bcrypt = require('bcrypt'); // Import bcrypt
var routerUser = express.Router();
const isAuthenticated = require('./authMiddleware'); // Import your authentication middleware

routerUser.use(isAuthenticated);

const MydataCustemer = require('../models/myDataSchema'); // Ensure correct path

// Routes
routerUser.get('/user/add.html', (req, res) => {
  res.render('user/add');
});

// Handle form submission to add a new customer
routerUser.post('/user/add.html', async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      password,
      Phone,
      Age,
      Country,
      Gender,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newCustomer = new MydataCustemer({
      FirstName,
      LastName,
      Email,
      password: hashedPassword, // Store the hashed password
      Phone,
      Age,
      Country,
      Gender
    });

    await newCustomer.save();
    res.redirect('/hoooommme.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

module.exports = routerUser;
