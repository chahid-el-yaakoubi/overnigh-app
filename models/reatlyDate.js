const mongoose = require('mongoose');

const realtySchema = new mongoose.Schema({
    partnerName: String,
    partnerLastName: String,
    phoneNumber: { type: String, match: /^[0-9]{10}$/ },
    city: String,
    neighborhood: String,
    type: String,
    piececount: Number,
    apartmentName: String,
    furniture: Boolean,
    elevator: Boolean,
    floor: Number,
    area: Number,
    price: Number,
    CondominiumFees: String,
    PaymentTerms: String,
    DateCreate: String,
    status: String,
    position: String,
    rooms: {
        RoomCount: Number,
        RoomDescription: String,
    },
    features: [
        {
            item: String,
            description: String
        }
    ],
    images: [String],
    descriptions: [String],
}, { timestamps: true });

const Realty =  mongoose.model('Realty', realtySchema);

module.exports = Realty;
