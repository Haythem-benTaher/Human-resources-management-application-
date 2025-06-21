const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OffreSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    date : {
        type: Date,
    },
    date_creation: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Offre = mongoose.model('Offre', OffreSchema);

module.exports = Offre;
