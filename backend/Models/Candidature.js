const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidatureSchema = new Schema({
    cv: {
        type: Buffer,
        required: true
    },
    lettreDeMotivation: {
        type: Buffer,
        required: true
    },
    disponibilite: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        default: 'Not Processed'
    },
    dateSoumission: {
        type: Date,
        default: Date.now
    },
        userId: {
        type: Schema.Types.ObjectId,
        ref: 'Candidat',
        
    },
        offreId: {
        type: Schema.Types.ObjectId,
        ref: 'Offre'
    }
});

const Candidature = mongoose.model('Candidature', CandidatureSchema);

module.exports = Candidature;