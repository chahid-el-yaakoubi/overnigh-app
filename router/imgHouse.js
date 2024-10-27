const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const routerAddHouse = express.Router();
const House = require('../models/houseData');
const isAuthenticated = require('./authMiddleware'); // Import your authentication middleware

routerAddHouse.use(isAuthenticated); 

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filenames
  },
});

const upload = multer({ storage: storage });

// Route to handle image uploads
routerAddHouse.post('/user/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    const { houseId } = req.body;
    const imagePaths = req.files.map(file => '/uploads/' + file.filename);

    if (!houseId) {
      return res.status(400).send('House ID is required');
    }

    // Find the house by ID
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).send('House not found');
    }

    // Add the new images to the existing ones
    house.images = house.images ? house.images.concat(imagePaths) : imagePaths;

    await house.save();

    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('An error occurred while uploading images.');
  }
});

routerAddHouse.post('/user/remove-image', async (req, res) => {
  const { houseId, imagePath } = req.body;
  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).send('House not found');

    // Remove image from the house's images array
    house.images = house.images.filter(img => img !== imagePath);
    await house.save();

    // Delete the file from the server
    const fullImagePath = path.join(__dirname, '../public', imagePath);
    fs.unlinkSync(fullImagePath);

    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error removing image:', error);
    res.status(500).send('Error removing image');
  }
});

routerAddHouse.post('/user/update-image', upload.single('newImage'), async (req, res) => {
  const { houseId, oldImagePath } = req.body;
  const newImage = req.file;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).send('House not found');

    // Replace the old image path with the new image path
    const newImagePath = '/uploads/' + newImage.filename;
    house.images = house.images.map(img => (img === oldImagePath ? newImagePath : img));
    await house.save();

    // Delete the old image file from the server
    const fullOldImagePath = path.join(__dirname, '../public', oldImagePath);
    fs.unlinkSync(fullOldImagePath);

    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send('Error updating image');
  }
});


module.exports = routerAddHouse;
