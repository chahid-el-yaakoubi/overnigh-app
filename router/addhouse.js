const express = require('express');
const routerAddHouse = express.Router();
const isAuthenticated = require('./authMiddleware'); // Import your authentication middleware
const House = require('../models/houseData');
routerAddHouse.use(isAuthenticated); 

const categories = [
  { section: 'Informations générales', items: ['Piscine extérieure', 'Parking gratuit', 'Chambres familiales', 'Chambres fumeurs', 'Terrasse', 'Service de ménage quotidien', 'Internet (Wi-Fi)', 'Vue', 'Cuisine', 'Ascenseur', 'Climatisation', 'Télévision'] },
  { section: 'Cuisine', items: ['Table à manger', 'Machine à café', 'Four', 'Ustensiles de cuisine', 'Bouilloire électrique', 'Lave-vaisselle', 'Réfrigérateur', 'Micro-ondes', 'Lave-linge', 'Sèche-linge'] },
  { section: 'High-tech', items: ['Télevision', 'Télévision à écran plat'] },
  { section: 'Coin salon', items: ['Coin repas', 'Canapé', 'Bureau'] },
  { section: 'Salle de bains', items: ['Papier toilette', 'Serviettes', 'Baignoire ou douche', 'Chaussons', 'Salle de bains privative', 'Toilettes', 'Articles de toilette gratuits', 'Sèche-cheveux'] },
  { section: 'Equipements en chambre', items: ['Prise près du lit', 'Étendoir', 'Portant', 'Chauffage', 'Ventilateur', 'Matériel de repassage', 'Fer à repasser'] },
  { section: 'Vues', items: ['jardin', 'plage'] },
  { section: 'Extérieur', items: ['balcon', 'patio'] },
  { section: 'Sécurité', items: ['Caméras de surveillance', 'Coffre-fort', 'Alarme de sécurité', 'Sécurité 24h/24'] },
];
const environment = ['Lieux à proximité', 'Restaurants et cafés', 'Plages à proximité', 'Transports en commun', 'Aéroports les plus proches'];

// Render the form
routerAddHouse.get('/user/addhouse.html', (req, res) => {
  res.render('user/addhouse', { categories, environment });
});

routerAddHouse.get('/user/addimgHouse.html', (req, res) => {
  res.render('user/addimgHouse', { environment });
});

// add img


// New route to handle both create and update
routerAddHouse.post('/user/addhouse.html', async (req, res) => {
  try {
    const { id, partnerName, partnerLastName, type, nightmonth, furniture, phoneNumber, city, neighborhood, position, apartmentName, floor, area, price, typee, persons, description } = req.body;
    const rooms = Array.isArray(typee)
      ? typee.map((t, index) => ({
        typee: t,
        description: description[index],
      }))
      : [];

    const selectedFeaturesBySection = {};
    categories.forEach(category => {
      const selectedItems = category.items.filter(item => req.body[`available_${item}`]);
      if (selectedItems.length > 0) {
        selectedFeaturesBySection[category.section] = selectedItems;
      }
    });

    // Handle environment data
    const environmentData = {};

    environment.forEach((env) => {
      const titleKey = `${env}Title`; // Key for title input
      const distanceKey = `${env}Distance`; // Key for distance input
      const titles = req.body[titleKey]; // Access titles
      const distances = req.body[distanceKey]; // Access distances

      // Check if titles and distances are arrays and have the same length
      if (Array.isArray(titles) && Array.isArray(distances) && titles.length === distances.length) {
        environmentData[env] = titles.map((title, index) => ({
          title,
          distance: distances[index],
        }));
      }
    });

    const descriptions = (req.body.descriptions || []).filter(description => description.trim() !== '');


    if (id) {
      // Update existing house
      await House.findByIdAndUpdate(id, {
        partnerName,
        partnerLastName,
        phoneNumber,
        city,
        neighborhood,
        type,
        nightmonth,
        furniture,
        apartmentInfo: {
          position,
          apartmentName,
          floor,
          area,
          price,
        },
        rooms,
        features: selectedFeaturesBySection,
        environment: environmentData,
        descriptions: descriptions,
        condition: {
          arrival: req.body.arrival,
          departure: req.body.departure,
          smoker: req.body.smoker,
          animal: req.body.animal,
          holidays: req.body.holidays,
          ageRestriction: req.body.ageRestriction,
          ageRestrictionDsc: req.body.ageRestrictionDsc,
          bebebeds: req.body.bebebeds,
          bedsRestrictionDsc: req.body.bedsRestrictionDsc,
        }
      });
    } else {
      // Create new house
      const newHouse = new House({
        partnerName,
        partnerLastName,
        phoneNumber,
        city,
        neighborhood,
        type,
        nightmonth,
        furniture,
        apartmentInfo: {
          position,
          apartmentName,
          floor,
          area,
          price,

        },
        rooms,
        features: selectedFeaturesBySection,
        environment: environmentData,
        descriptions: descriptions,
        condition: {
          arrival: req.body.arrival,
          departure: req.body.departure,
          smoker: req.body.smoker,
          animal: req.body.animal,
          holidays: req.body.holidays,
          ageRestriction: req.body.ageRestriction,
          ageRestrictionDsc: req.body.ageRestrictionDsc,
          bebebeds: req.body.bebebeds,
          bedsRestrictionDsc: req.body.bedsRestrictionDsc,
        }
      });

      await newHouse.save();
    }

    res.redirect('/dataHouse');
  } catch (error) {
    console.error('Error adding or updating house:', error);
    res.status(500).send('An error occurred while adding or updating the house.');
  }
});

routerAddHouse.get('/detailhouse/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    res.render('clientUser/home', { house });
  } catch (error) {
    res.status(500).send("Error retrieving house data");
  }
});


module.exports = routerAddHouse;
