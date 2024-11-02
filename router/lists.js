const locations = {
    "Region Tanger-Tetouan-Al Hoceima": [
      "Tanger", "Tetouan", "Larache", "Asilah", "Martil", "Al-Madiq", "Beni Bouayach", "Ajdir", "Al-Qasr Al-Kabir", "Chefchaouen", "Ouezzane"
    ],
    "Region Oriental": [
      "Oujda", "Bni Drar", "Al-Naimah", "Aklim", "Sidi Slimane Al-Sharqiyah", "Driouch", "Ain Bni Mathar", "Taforalt", "Ain Bni Mouh", "Jerada", "Ain Bni Mitir", "Bouarfa", "Figuig", "Ain Chouater", "An-Nador", "Zayu", "Al-Aroui", "Al-Taouanah", "Ras Al-Maa", "Silwan", "Darwish", "Mezguane", "Saidia", "Bin Tidal", "Zaio", "Ras Al-Zaqaz", "Aghbalou Aqorar", "Boulemane Al-Mesrah", "Ufran"
    ],
    "Region Fes-Meknes": [
      "Fes", "Meknes", "Al-Midar", "Boulemane", "Tamasi", "Moulay Yacoub", "Zrhun", "Sidi Harazem", "Ben Sleeman", "Home", "Inhzal", "Amsraho", "Moulay Bouazza", "Khnansa", "Tislat", "Tifflet", "Souq Taflet", "Ajnad", "Aksarat", "Rbat Al-Khair", "Bin Talut", "Seba Fassi", "Sabib Al-Amir Muhammad", "Zawyat Hrawa", "Tabiat", "Tanat", "Zahir Al-Suq", "Tinast", "Aghbalou"
    ],
    "Region Rabat-Sale-Kenitra": [
      "Rabat", "Sale", "Temara", "Al-Quneitra", "Sidi Bouknadel", "Ain Atiq", "Al-Mehalla", "Khmissat", "Souq Al-Khamees", "Al-Karimiyah", "Sidi Taib", "Ain Aouda", "Adaya", "Sidi Yahya Al-Zaer", "Souq Sidi Yahya Al-Zaer", "Al-Ramni", "Al-Kortiyah", "Zawyat Lala Maryam", "Bani Al-Hussein", "Sidi Kassim", "Zawyat Al-Sheikh", "Sidi Hay", "Ain Sbaie", "Ain Ormad", "Ain Jabal", "Ain Amur", "Sidi Al-Sheikh"
    ],
    "Region Beni Mellal-Khenifra": [
      "Beni Mellal", "Azilal", "Kasbah Tadla", "Oulad Ayyad", "Oulad Ayyad", "Fkih Ben Saleh"
    ],
    "Region Casablanca-Settat": [
      "Casablanca", "Mohammedia", "Settat", "Ben Suleiman", "Sidi Bennour", "Al-Khouribga", "New Oulad Al-Nasiri", "Boujad", "Sidi Al-Haj Abd Al-Salam", "Lwala", "Lualat Al-Buhairah", "Birj Mounir", "Tamadoult", "Bir Mash", "Hammah Sibrah", "Sidi Al-Bashir", "Haj Talat", "Haj Ayyad", "Haj Al-Amin", "Amouzat", "Jamaa Sabih", "Jamaya Fatouh"
    ],
    "Region Marrakech-Safi": [
      "Marrakech", "Essaouira", "Al-Mansuriyah", "Abu Al-Jabbar", "Ladaqrah", "Souira Qedima", "Asfi", "Lamalh Al-Amamrah", "Hjalat Al-Naima", "Shushawan", "Al-Qasbah Al-Shahani", "Tamellalt", "Ousoultana", "Castle Of Tsagt", "Al-Farmah", "House Of The Sheik"
    ],
    "Region Draa-Tafilalet": [
      "Al-Rashidiya", "Arfoud", "Mazzer", "Tinjdad", "Askar", "Kseiba Tadgha", "Arfoud", "Tinherir", "Dades", "Kasbah Of Tinihdat", "Kelaat M'Gouna", "Castle of Rida"
    ],
    "Region Souss-Massa": [
      "Agadir", "Ait Melloul", "Taroudant", "Ait Baha", "Tata", "Ait Yahya", "Tarzazte", "Ouarzazate", "Tamllalt", "Imzouren", "Imouzzer", "Tanalt"
    ],
    "Region Guelmim-Oued Noun": [
      "Guelmim", "Asrir", "M'sakin", "Bouizakarne", "Ifrane"
    ],
    "Region Laayoune-Sakia El Hamra": [
      "Laayoune", "Asmar", "Tarafaya", "Al-Shwiyah", "Al-Bahriyah"
    ],
    "Region Dakhla-Oued Ed-Dahab": [
      "Dakhla", "Asia"
    ]
  }

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
  