const MydataCustemer = require('../models/myDataSchema'); // Ensure correct path
const Houses = require('../models/houseData')
const Realty = require('../models/reatlyDate')
const moment = require('moment');
const categories = [
  { section: 'Informations générales', items: ['Piscine extérieure', 'Parking gratuit', 'Chambres familiales', 'Chambres non-fumeurs', 'Terrasse', 'Service de ménage quotidien', 'Internet (Wi-Fi)', 'Vue', 'Cuisine', 'Ascenseur', 'Climatisation', 'Télévision'] },
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


// Handler to get all users

const user_data_get = (req, res) => {
  MydataCustemer.find()
    .then(data => {
      res.render('user/dataUser', { data, moment });
    })
    .catch(err => console.error(err));
};


const realty_data_get = (req, res) => {
  Realty.find()
    .then(dataRealty => {
      res.render('user/dataRealty', { dataRealty, moment });
    })
    .catch(err => console.error(err));
};

const user_index_get = async(req, res) => {
  try {
    const countA = await MydataCustemer.countDocuments({});
    const countB = await Houses.countDocuments({});
    const countC = await Realty.countDocuments({});
    res.render('index', {
      countA: countA,
      countB: countB,
      countC: countC,
      
    });
  } catch (err) {
    console.error('Error counting documents:', err);
    res.status(500).send('Error retrieving counts');
  }
};






const house_index_get = (req, res) => {
  Houses.countDocuments()
    .then(counthouse => {
      res.render('index', { counthouse, moment });
      // res.render('user/dataUser', { count, moment });
    })
    .catch(err => console.error(err));
};
const user_house_get = (req, res) => {
  Houses.find()
    .then(datahouse => 
      res.render('user/dataHouse', { datahouse, moment }))
    .catch(err => console.error(err));

};
const house_edit_get = (req, res) => {
  Houses.findById(req.params.id)
    .then(house => 
      res.render('user/edithouse', { house, categories, environment, locations }),
      // res.render('index', { counthouse: datah })
    )
    .catch(err => console.error(err));

};
const house_edit_delete = (req, res) => {
  Houses.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/dataHouse'))
    .catch(err => console.error(err));
};
const realty_edit_delete = (req, res) => {
  Realty.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/dataRealty'))
    .catch(err => console.error(err));
};
const houseimgs_edit_get = (req, res) => {
  Houses.findById(req.params.id)
    .then(datah => res.render('user/addimgHouse', { house: datah }))
    .catch(err => console.error(err));

};
const realtyimgs_edit_get = (req, res) => {
  Realty.findById(req.params.id)
    .then(datah => res.render('user/addimgRealty', { house: datah }))
    .catch(err => console.error(err));

};
// Handler to search users by first or last name
// const user_search_get = (req, res) => {
//   const searchParams = req.query.searchText || ''; // Use query params from GET request
//   MydataCustemer.find({ 
//     $or: [
//       { FirstName: new RegExp(searchParams, 'i') }, 
//       { LastName: new RegExp(searchParams, 'i') }
//     ]
//   })
//     .then(data => res.render('user/dataUser', { data, moment }))
//     .catch(err => console.error(err));
// };

// Handler to delete a user by ID
const user_edit_delete = (req, res) => {
  MydataCustemer.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/dataUser'))
    .catch(err => console.error(err));
};

// Handler to update a user by ID
const user_edit_put = (req, res) => {
  MydataCustemer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then(() => res.redirect('/hoooommme.html'))
    .catch(err => console.error(err));
};

// Handler to render edit form for a specific user
const user_edit_get = (req, res) => {
  MydataCustemer.findById(req.params.id)
    .then(data => res.render('user/edit', { dataobj: data }))
    .catch(err => console.error(err));
};

// Handler to view a specific user
const user_view_get = (req, res) => {
  MydataCustemer.findById(req.params.id)
    .then(obj => res.render('user/view', { dataobj: obj, moment }))
    .catch(err => console.error(err));
};

const user_cities_get = (req, res) => {
  res.render('user/cities');
}


module.exports = {
  user_index_get,
  // user_search_get,
  user_edit_delete,
  user_edit_put,
  user_edit_get,
  user_view_get,
  user_data_get,
  user_house_get,
  house_edit_get,
  house_edit_delete,
  houseimgs_edit_get,
  house_index_get,
  realty_data_get,
  realty_edit_delete,
  realtyimgs_edit_get,
  user_cities_get,
 // user_data_post,
};
