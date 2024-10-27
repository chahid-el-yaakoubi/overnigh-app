const MydataCustemer = require('../models/myDataSchema'); // Ensure correct path
const Houses = require('../models/houseData')
const Realty = require('../models/reatlyDate')
const moment = require('moment');
const categories = [
  { section: 'Informations générales', items: ['Piscine extérieure', 'Parking gratuit', 'Chambres familiales', 'Chambres non-fumeurs', 'Terrasse', 'Service de ménage quotidien', 'Internet (Wi-Fi)', 'Vue', 'Cuisine', 'Ascenseur', 'Climatisation', 'Télévision'] },
  { section: 'Cuisine', items: ['Table à manger', 'Machine à café', 'Four', 'Ustensiles de cuisine', 'Bouilloire électrique', 'Lave-vaisselle', 'Réfrigérateur', 'Micro-ondes', 'Lave-linge', 'Sèche-linge'] },
  { section: 'High-tech', items: ['Télévision', 'Télévision à écran plat'] },
  { section: 'Coin salon', items: ['Coin repas', 'Canapé', 'Bureau'] },
  { section: 'Salle de bains', items: ['Papier toilette', 'Serviettes', 'Baignoire ou douche', 'Chaussons', 'Salle de bains privative', 'Toilettes', 'Articles de toilette gratuits', 'Sèche-cheveux'] },
  { section: 'Equipements en chambre', items: ['Prise près du lit', 'Étendoir', 'Portant', 'Chauffage', 'Ventilateur', 'Matériel de repassage', 'Fer à repasser'] },
  { section: 'Vues', items: ['jardin', 'plage'] },
  { section: 'Extérieur', items: ['balcon', 'patio'] },
  { section: 'Sécurité', items: ['Caméras de surveillance', 'Coffre-fort', 'Alarme de sécurité', 'Sécurité 24h/24'] },
];

const environment = ['Lieux à proximité', 'Restaurants et cafés', 'Plages à proximité', 'Transports en commun', 'Aéroports les plus proches'];


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
      countC: countC
    });
  } catch (err) {
    console.error('Error counting documents:', err);
    res.status(500).send('Error retrieving counts');
  }
};

const user_login_get = async(req, res) => {
  try {
    const countA = await MydataCustemer.countDocuments({});
    

    res.render('Login', {
      countA: countA,
    });
  } catch (err) {
    console.error('Error counting documents:', err);
    res.status(500).send('Error retrieving counts');
  }
};

const house_index_get = (req, res) => {
  Houses.countDocuments()
    .then(counthouse => {
      console.log(counthouse);
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
      res.render('user/edithouse', { house, categories, environment }),
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
    .then(() => res.redirect('/'))
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
  user_login_get
};
