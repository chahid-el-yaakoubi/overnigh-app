const express = require('express');
const routerAddRealty = express.Router();
const Realty = require('../models/reatlyDate');
const moment = require('moment');


const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../public/uploads1');
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
const categories = [
    {
        section: 'Informations',
        items: ['Parking',
            'Balcon',
            'Terrasse',
            'Cuisine',
            'salle de bain',
            'chaufage',
            'salon',
            'Internet (Wi-Fi)',
            'Vue',
            'Climatisation',
            'Isolation Phonique',
            'Isolation Thermique ',


        ]
    },
    {
        section: 'Proximité',
        items: [
            'Restaurants',
            'Cafés',
            'Plages',
            'Gares',
            'Écoles',
            'Centres Commerciaux',
            'Hôpitaux',
            'Supermarchés',
            'Magasins',
            'Cafés',
            'Stations d\'essence',
            'Gare Routière',
            'Piscines',
            'Parcs',
            'salle de sport',
            'Espaces Verts',
            'Espaces de Jeux pour Enfants'

        ]
    },

];

// Render the form
routerAddRealty.get('/addrealty.html', (req, res) => {
    res.render('user/addRealty', { categories });
});


routerAddRealty.post('/addRealty.html', async (req, res) => {
    try {
        const realtyId = req.body.realtyId;
        const { partnerName, partnerLastName, phoneNumber, city, neighborhood, type, piececount,
            apartmentName, furniture, elevator, floor, area, price, CondominiumFees,
            PaymentTerms, DateCreate, status, position, RoomCount, RoomDescription } = req.body;

        // Parse categories and features from request body, with default values to avoid errors
        const featuresData = [];
        categories.forEach(category => {
            category.items.forEach(item => {
                const isChecked = req.body[`available_${item}`];
                const description = req.body[`description${item}`];

                if (isChecked) {
                    featuresData.push({ item, description: description.trim() || "" });
                }
            });
        });



        // Data object to create or update realty entry
        const realtyData = {
            partnerName,
            partnerLastName,
            phoneNumber,
            city,
            neighborhood,
            type,
            piececount,
            apartmentName,
            furniture,
            elevator,
            floor,
            area,
            price,
            CondominiumFees,
            PaymentTerms,
            DateCreate,
            status,
            position,
            rooms: {
                RoomCount,
                RoomDescription,
            },
            features: featuresData,  // Include formatted categories here
        };

        console.log("Realty data:", realtyData);
        let realty;
        if (realtyId) {
            // Update if realtyId exists
            realty = await Realty.findByIdAndUpdate(realtyId, realtyData, { new: true });
        } else {
            // Create new realty entry if realtyId is not provided
            realty = new Realty(realtyData);
            await realty.save();
        }

        res.redirect('/dataRealty'); // Adjust redirection as needed
    } catch (error) {
        console.error("Error saving realty data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to render the edit form
routerAddRealty.get('/realty/:id-edit', async (req, res) => {
    try {
        const realty = await Realty.findById(req.params.id);
        if (!realty) {
            return res.status(404).send("Realty not found");
        }

        // Render the edit page with existing data
        res.render('../views/user/editReality.ejs', { realty, categories });
    } catch (error) {
        console.error("Error fetching realty data for editing:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle image uploads
routerAddRealty.post('/update-imagerealty', upload.array('images', 10), async (req, res) => {
    try {
        const { houseId } = req.body;
        const imagePaths = req.files.map(file => '/uploads1/' + file.filename);

        if (!houseId) {
            return res.status(400).send('House ID is required');
        }

        // Find the house by ID
        const house = await Realty.findById(houseId);

        if (!house) {
            return res.status(404).send('House not found');
        }

        // Add the new images to the existing ones
        house.images = house.images ? house.images.concat(imagePaths) : imagePaths;

        await house.save();

        res.redirect(`/realty/${houseId}-eimgs`); // Changed to match your HTML routing
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).send('An error occurred while uploading images.');
    }
});

// Route to remove an image
routerAddRealty.post('/remove-imagerealty', async (req, res) => {
    const { houseId, imagePath } = req.body;
    try {
        const house = await Realty.findById(houseId); // Ensure you're using Realty here
        if (!house) return res.status(404).send('House not found');

        // Remove image from the house's images array
        house.images = house.images.filter(img => img !== imagePath);
        await house.save();

        // Delete the file from the server
        const fullImagePath = path.join(__dirname, '../public', imagePath);
        fs.unlinkSync(fullImagePath);

        res.redirect(`/realty/${houseId}-eimgs`);
    } catch (error) {
        console.error('Error removing image:', error);
        res.status(500).send('Error removing image');
    }
});

// Route to update an image

routerAddRealty.post('/update-imagerealty', upload.single('newImage'), async (req, res) => {
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

module.exports = routerAddRealty;
