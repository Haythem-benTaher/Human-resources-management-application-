const Candidature = require('../models/Candidature');

const saveCandidature = (req, res, next) => {
  const { disponibilite, etat, userID, offreID } = req.body;

  // Check if files are present
  if (!req.files || !req.files.cv || !req.files.lettreDeMotivation) {
    return res.status(400).json({ error: 'Files cv and lettreDeMotivation are required' });
  }

  const cv = req.files.cv[0].buffer; // Use .buffer to access binary data
  const lettreDeMotivation = req.files.lettreDeMotivation[0].buffer;

  // Create a new Candidature document with userID and offreID
  const candidature = new Candidature({ 
    cv, 
    lettreDeMotivation, 
    disponibilite, 
    etat, 
    userId: userID,     // Add userID
    offreId: offreID    // Add offreID
  });

  candidature.save()
    .then(savedCandidature => res.status(200).json(savedCandidature))
    .catch(error => res.status(400).json({ error }));
};
const updateCandidature = (req, res, next) => {
  const { disponibilite, etat } = req.body;

  // Prepare update data
  const updateData = { disponibilite, etat };

  // Handle files if they are present
  if (req.files) {
    if (req.files.cv && req.files.cv[0]) {
      updateData.cv = req.files.cv[0].buffer; // Use .buffer to access binary data
    }
    if (req.files.lettreDeMotivation && req.files.lettreDeMotivation[0]) {
      updateData.lettreDeMotivation = req.files.lettreDeMotivation[0].buffer;
    }
  }

  Candidature.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then(updatedCandidature => res.status(200).json(updatedCandidature))
    .catch(error => res.status(400).json({ error }));
};

const getAllCandidatures = (req, res, next) => {
  Candidature.find()
    .then(candidatures => res.status(200).json(candidatures))
    .catch(error => res.status(400).json({ error }));
};

const getCandidatureById = (req, res, next) => {
  Candidature.findById(req.params.id)
    .then(candidature => res.status(200).json(candidature))
    .catch(error => res.status(404).json({ error }));
};

const deleteCandidature = (req, res, next) => {
  Candidature.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ message: 'Candidature deleted' }))
    .catch(error => res.status(400).json({ error }));
};

const downloadCV = (req, res, next) => {
  Candidature.findById(req.params.id)
    .then(candidature => {
      if (!candidature || !candidature.cv) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="cv.pdf"');
      res.send(candidature.cv);
    })
    .catch(error => res.status(400).json({ error }));
};

const downloadLettreDeMotivation = (req, res, next) => {
  Candidature.findById(req.params.id)
    .then(candidature => {
      if (!candidature || !candidature.lettreDeMotivation) {
        return res.status(404).json({ error: 'Lettre de motivation not found' });
      }

      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="lettre_de_motivation.pdf"');
      res.send(candidature.lettreDeMotivation);
    })
    .catch(error => res.status(400).json({ error }));
};

module.exports = {
  saveCandidature,
  getAllCandidatures,
  getCandidatureById,
  updateCandidature,
  deleteCandidature,
  downloadCV,
  downloadLettreDeMotivation
};