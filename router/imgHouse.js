const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const routerAddHouse = express.Router();
const House = require('../models/houseData');
const isAuthenticated = require('./authMiddleware');
require('dotenv').config();

routerAddHouse.use(isAuthenticated);

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image uploads
routerAddHouse.post('/user/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    const { houseId } = req.body;
    if (!houseId) {
      return res.status(400).send('House ID is required');
    }

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).send('House not found');
    }

    // Upload each image to Cloudinary with folder name and get the URLs
    const imageUrls = await Promise.all(req.files.map(async (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'houses' }, // Specify the folder
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    }));

    house.images = house.images ? house.images.concat(imageUrls) : imageUrls;
    await house.save();

    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('An error occurred while uploading images.');
  }
});

// Route to update an image
routerAddHouse.post('/user/update-image', upload.single('newImage'), async (req, res) => {
  const { houseId, oldImagePath } = req.body;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).send('House not found');

    if (req.file) {
      const newImagePath = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'houses' }, // Specify the folder
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      house.images = house.images.map(img => (img === oldImagePath ? newImagePath : img));
    }

    await house.save();
    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send('Error updating image');
  }
});

// Route to remove an image
routerAddHouse.post('/user/remove-image', async (req, res) => {
  const { houseId, imagePath } = req.body;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).send('House not found');

    // Remove the image from Cloudinary
    const publicId = `houses/${imagePath.split('/').pop().split('.')[0]}`; // Include folder in public ID
    await cloudinary.uploader.destroy(publicId);

    house.images = house.images.filter(img => img !== imagePath);
    await house.save();

    res.redirect(`/house/${houseId}-eimgs`);
  } catch (error) {
    console.error('Error removing image:', error);
    res.status(500).send('Error removing image');
  }
});

module.exports = routerAddHouse;
