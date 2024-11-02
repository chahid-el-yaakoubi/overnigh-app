const express = require('express');
const routerAddHouse = express.Router();
const isAuthenticated = require('./authMiddleware'); // Import your authentication middleware
const House = require('../models/houseData');
routerAddHouse.use(isAuthenticated); 

const categories = [
  { section: 'Informations générales', items: ['Piscine extérieure', 'Parking gratuit', 'Chambres familiales', 'Terrasse', 'Service de ménage quotidien', 'Internet (Wi-Fi)', 'Vue', 'Cuisine', 'Ascenseur', 'Climatisation', 'Télévision'] },
  { section: 'Cuisine', items: ['Table à manger', 'Machine à café', 'Four', 'Ustensiles de cuisine', 'Bouilloire électrique', 'Lave-vaisselle', 'Réfrigérateur', 'Micro-ondes', 'Lave-linge', 'Sèche-linge'] },
  { section: 'High-tech', items: ['Télevision', 'Télévision à écran plat'] },
  { section: 'Coin salon', items: ['Coin repas', 'Canapé', 'Bureau'] },
  { section: 'Salle de bains', items: ['Papier toilette', 'Serviettes', 'Baignoire ou douche', 'Chaussons', 'Salle de bains privative', 'Toilettes', 'Articles de toilette gratuits', 'Sèche-cheveux'] },
  { section: 'Equipements en chambre', items: ['Prise près du lit', 'Étendoir', 'Portant', 'Chauffage', 'Ventilateur', 'Matériel de repassage', 'Fer à repasser'] },
  { section: 'Vues', items: ['jardin', 'plage', 'rue'] },
  { section: 'Extérieur', items: ['balcon', 'patio'] },
  { section: 'Sécurité', items: ['Caméras de surveillance', 'Coffre-fort', 'Alarme de sécurité', 'Sécurité 24h/24'] },
];
const environment = ['Lieux à proximité', 'Restaurants et cafés', 'Plages à proximité', 'Transports en commun', 'Aéroports les plus proches'];
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



// Render the form
routerAddHouse.get('/user/addhouse.html', (req, res) => {
  res.render('user/addhouse', { categories, environment , locations });
});

routerAddHouse.get('/user/addimgHouse.html', (req, res) => {
  res.render('user/addimgHouse', { environment });
});

// add img


// New route to handle both create and update
routerAddHouse.post('/user/addhouse.html', async (req, res) => {
  try {
    const { id, partnerName, partnerLastName, type, nightmonth, furniture, phoneNumber, city, neighborhood, position, apartmentName, floor, area, price, typee, region, description } = req.body;
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
        region,
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
        region,
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
