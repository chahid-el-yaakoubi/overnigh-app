const express = require('express');
const routerAddRealty = express.Router();
const Realty = require('../models/reatlyDate'); // Fix the model name if needed
const isAuthenticated = require('./authMiddleware'); // Import authentication middleware
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

routerAddRealty.use(isAuthenticated);

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure Multer storage (keep it in memory for streaming to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Categories data
const categories = [
    { section: 'Informations', items: ['Parking', 'Balcon', 'Terrasse', 'Cuisine', 'salle de bain', 'chaufage', 'salon', 'Internet (Wi-Fi)', 'Vue', 'Climatisation', 'Isolation Phonique', 'Isolation Thermique'] },
    { section: 'Proximité', items: ['Restaurants', 'Cafés', 'Plages', 'Gares', 'Écoles', 'Centres Commerciaux', 'Hôpitaux', 'Supermarchés', 'Magasins', 'Stations d\'essence', 'Gare Routière', 'Piscines', 'Parcs', 'salle de sport', 'Espaces Verts', 'Espaces de Jeux pour Enfants'] }
];
const locations = {
    "Région Tanger-Tétouan-Al Hoceïma": [
      "Tanger",
      "Tétouan",
      "Larache",
      "Asilah",
      "Akninaya",
      "Fnideq",
      "Martil",
      "Mdiq",
      "Oued Lou",
      "Al Hoceïma",
      "Beni Bouayach",
      "Imzouren",
      "Targuist",
      "Ajdir",
      "Ksar el Kebir",
      "Chefchaouen",
      "Ouezzane"
    ],
    "Région de l'Oriental": [
      "Oujda",
      "Beni Drar",
      "Naimia",
      "Ahfir",
      "Ain Rekhada",
      "Aklim",
      "Berkane",
      "Saïdia",
      "Sidi Slimane Echcharaa",
      "Driouech",
      "El Aïoun Sidi Mellouk",
      "Taourirt",
      "Jrada",
      "Aïn-Béni-Mathar",
      "Touissit",
      "Bouarfa",
      "Figuig",
      "Al Aroui",
      "Beni Ansar",
      "Nador",
      "Zaio",
      "Azghenegane",
      "Ras el Ma",
      "Selouane",
      "Debdou",
      "Midar",
      "Ben Tayeb"
    ],
    "Région Fès-Meknès": [
      "Fès",
      "Jamaa el Mchour Fès Jdid",
      "Meknès",
      "Mchour Setin",
      "Boufkrane",
      "Toual",
      "Moulay Idriss Zerhoun",
      "Weislane",
      "Boulmane",
      "Imouzzer Marmoucha",
      "Missour",
      "Outat El Haj",
      "Bhalil",
      "Manzel",
      "Imouzzer Kender",
      "Rabat el Khir",
      "Sefrou",
      "Moulay Yacoub",
      "Akkourai",
      "Ain Tazaghout",
      "Al Hajeb",
      "Sebaa Ayoune",
      "Aknoul",
      "Oued Amlel",
      "Tahla",
      "Taza",
      "Ghafsai",
      "Qarya Ba Mohamed",
      "Tayounate",
      "Tihsate",
      "Azrou",
      "Ifrane"
    ],
    "Région Rabat-Salé-Kénitra": [
      "Rabat",
      "Salé",
      "Temara",
      "Kénitra",
      "Khemisset",
      "Tawarka",
      "Sidi Bouknadel",
      "Ain Aouda",
      "Harhoura",
      "Sakhira",
      "Ain Atiq",
      "Mahdia",
      "Sidi Yahiya El Gharb",
      "Sidi Bouknadel",
      "Sidi Yahiya El Gharb",
      "Souk El Arbaa",
      "Rammane",
      "Tiflet",
      "Sidi Aallal El Bahra",
      "Oulad Kourt",
      "Jorf El Melha",
      "Mcherif Blqsiri",
      "Sidi Qasim",
      "Sidi Slimane",
      "Sidi Yahiya El Gharb"
    ],
    "Région Beni Mellal-Khénifra": [
      "Beni Mellal",
      "Laqsiba",
      "Qasbat Tadla",
      "Zawiya Cheikh",
      "Bni Jdidi",
      "Bougniba",
      "Hatane",
      "Khenifra",
      "Oued Zem",
      "Mririt",
      "Khenifra",
      "Azilal",
      "Demnate",
      "Oulad Iyad",
      "Souk Sebt Oulad Nema",
      "Fqih Ben Salah"
    ],
    "Région Casablanca-Settat": [
      "Casablanca",
      "Mohammédia",
      "Settat",
      "El Jadida",
      "Ain Harrouda",
      "Ben Ahmed",
      "Brouj",
      "Oulad",
      "Oulad Amrah",
      "Berrechid",
      "Droua",
      "El Karia",
      "Had Soualem",
      "Oulad Abbou",
      "Sidi Rahal Plage",
      "Ben Slimane",
      "Bouznika",
      "El Mansouria",
      "Sidi Beni Nour",
      "Zmamra",
      "Nouasser",
      "Bouskoura",
      "Dar Bouazza",
      "El Harraouiyine",
      "Mediouna",
      "Tit Mellil",
      "Azemmour",
      "Bir Jdid"
    ],
    "Région Marrakech-Safi": [
      "Marrakech",
      "Mchour Al Qasbah",
      "Ait Ourir",
      "Amsmiz",
      "Tahanaout",
      "Chichaoua",
      "Imintanout",
      "Kelaa des Sraghna",
      "Sidi Rahal",
      "Tamalalt",
      "Essaouira",
      "Safy",
      "Jamaa Sihim",
      "Sbate Kzoula",
      "Ben Jrir",
      "Sidi Bouathman",
      "Youssoufia",
      "Chmaâa"
    ],
    "Région Drâa-Tafilalet": [
      "Errachidia",
      "Arfoud",
      "Boudenib",
      "Kelaa Maimine",
      "Al Jarf",
      "Chérif Ben Ali",
      "Tinjdad",
      "Akkad",
      "Zagora",
      "Midelt",
      "Rich",
      "Ouarzazate",
      "Taznaght",
      "Tinghir",
      "Boumalen Dadess",
      "Kelaa Mgouna"
    ],
    "Région Souss-Massa": [
      "Agadir",
      "Ait Melloul",
      "Dcheira El Jihadia",
      "Inzkan",
      "Qili'a",
      "Ait Aizah",
      "Oulouz",
      "Kerdan",
      "Ighrim",
      "Oulad Brahim",
      "Oulad Taima",
      "Taliouine",
      "Taroudant",
      "Tafraout",
      "Tiznit",
      "Ait Baha",
      "Bokkira",
      "Aqaf",
      "Moulay Idriss",
      "Fom Zigoud",
      "Tata"
    ],
    "Région Guelmim-Oued Noun": [
      "Guelmim",
      "Assa",
      "Zack",
      "Bouizkarne",
      "Tantan",
      "Al Watiya",
      "Sidi Ifni",
      "Alkhassass"
    ],
    "Région Laâyoune-Sakia El Hamra": [
      "Laâyoune",
      "La Marsa",
      "Tarfaya",
      "Boujdour",
      "Smarra"
    ],
    "Région Dakhla-Oued Ed-Dahab": [
      "Dakhla",
      "Lagouira"
    ]
  };
// Render add realty form
routerAddRealty.get('/addrealty.html', (req, res) => {
    res.render('user/addRealty', { categories, locations });
});

// Add or update realty data
routerAddRealty.post('/addRealty.html', async (req, res) => {
    try {
        const { realtyId, partnerName, partnerLastName, phoneNumber, region,city, neighborhood, type, piececount, apartmentName, furniture, elevator, floor, area, price, CondominiumFees, PaymentTerms, DateCreate, status, position, RoomCount, RoomDescription } = req.body;

        const featuresData = categories.flatMap(category => 
            category.items.map(item => {
                const isChecked = req.body[`available_${item}`];
                const description = req.body[`description${item}`];
                return isChecked ? { item, description: description.trim() || "" } : null;
            }).filter(Boolean)
        );

        const descriptions = (req.body.descriptions || []).filter(description => description.trim() !== '');

        const realtyData = {
            partnerName,
            partnerLastName,
            phoneNumber,
            region,
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
            rooms: { RoomCount, RoomDescription },
            features: featuresData,
            descriptions
        };

        // console.log(realtyData)
        const realty = realtyId ? await Realty.findByIdAndUpdate(realtyId, realtyData, { new: true }) : await new Realty(realtyData).save();
        res.redirect('/dataRealty'); 
    } catch (error) {
        console.error("Error saving realty data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Render edit form
routerAddRealty.get('/realty/:id-edit', async (req, res) => {
    try {
        const realty = await Realty.findById(req.params.id);
        if (!realty) return res.status(404).send("Realty not found");
        res.render('../views/user/editReality.ejs', { realty, categories, locations });
    } catch (error) {
        console.error("Error fetching realty data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Upload images to Cloudinary
routerAddRealty.post('/update-imagerealty', upload.array('images', 10), async (req, res) => {
    try {
        const { houseId } = req.body;
        if (!houseId) return res.status(400).send('House ID is required');

        const house = await Realty.findById(houseId);
        if (!house) return res.status(404).send('House not found');

        // Upload each image to Cloudinary and collect URLs
        const imageUrls = await Promise.all(req.files.map(async (file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder: 'realty' }, // Specify the folder
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

        res.redirect(`/realty/${houseId}-eimgs`);
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).send('An error occurred while uploading images.');
    }
});

// Remove an image from Cloudinary
routerAddRealty.post('/remove-imagerealty', async (req, res) => {
    const { houseId, imagePath } = req.body;
    try {
        const house = await Realty.findById(houseId);
        if (!house) return res.status(404).send('House not found');

        // Remove the image from Cloudinary
        const publicId = `realty/${imagePath.split('/').pop().split('.')[0]}`; // Include folder in public ID
        await cloudinary.uploader.destroy(publicId);

        house.images = house.images.filter(img => img !== imagePath);
        await house.save();

        res.redirect(`/realty/${houseId}-eimgs`);
    } catch (error) {
        console.error('Error removing image:', error);
        res.status(500).send('Error removing image');
    }
});

// Update an image in Cloudinary

  
// routerAddRealty.post('/update-imagerealty', upload.single('newImage'), async (req, res) => {
//     console.log('Request body:', req.body); // Log request body
//     console.log('Uploaded file:', req.file); // Log uploaded file

//     const { houseId, oldImagePath } = req.body;

//     try {
//         const house = await Realty.findById(houseId);
//         if (!house) return res.status(404).send('House not found');

//         if (req.file) {
//             // Your existing code for uploading the image...
//         } else {
//             console.log('No new image uploaded, keeping existing images.');
//         }

//         await house.save();
//         res.redirect(`/realty/${houseId}-eimgs`);
//     } catch (error) {
//         console.error('Error updating image:', error);
//         res.status(500).send('Error updating image');
//     }
// });



module.exports = routerAddRealty;
