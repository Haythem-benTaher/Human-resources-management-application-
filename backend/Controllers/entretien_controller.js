const Entretien = require('../models/entretien_model.js');

// Fonction pour obtenir tous les entretiens
 const getEntretiens = async (req, res) => {
  try {
    const entretiens = await Entretien.find({});
    res.status(200).json(entretiens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour obtenir un entretien spécifique
 const getEntretien = async (req, res) => {
  try {
    const { id } = req.params;
    const entretien = await Entretien.findById(id);
    if (!entretien) {
      return res.status(404).json({ message: 'Entretien not found' });
    }
    res.status(200).json(entretien);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createEntretien = async (req, res) => {
  try {
    const entretien = await Entretien.create(req.body);


    res.status(201).json(entretien);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Fonction pour mettre à jour un entretien existant
 const updateEntretien = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // // Vérifiez que les données de mise à jour sont valides (optionnel)
    // if (!updateData.title || !updateData.location || !updateData.dateandtime || !updateData.status) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    // Trouvez l'entretien par ID et mettez-le à jour
    const entretien = await Entretien.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!entretien) {
      return res.status(404).json({ message: 'Entretien not found' });
    }

    // Réponse avec l'entretien mis à jour
    res.status(200).json(entretien);
  } catch (error) {
    // Capturez et renvoyez les erreurs spécifiques
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour supprimer un entretien
 const deleteEntretien = async (req, res) => {
  try {
    const { id } = req.params;
    const entretien = await Entretien.findByIdAndDelete(id);

    if (!entretien) {
      return res.status(404).json({ message: 'Entretien not found' });
    }

    res.status(200).json({ message: 'Entretien deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour accepter ou refuser un entretien
 const changeEntretienStatus = async (req, res) => {
  try {
    const { id } = req.params;       // Récupère l'ID de l'entretien depuis les paramètres de la requête
    const { status } = req.body;     // Récupère le nouveau statut depuis le corps de la requête

    // Valide le statut pour qu'il soit soit 'accepted' soit 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Trouve et met à jour l'entretien par son ID, renvoie le document mis à jour
    const entretien = await Entretien.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    // Vérifie si l'entretien a été trouvé et mis à jour
    if (!entretien) {
      return res.status(404).json({ message: 'Entretien not found' });
    }

    // Réponse avec l'entretien mis à jour
    res.status(200).json(entretien);
  } catch (error) {
    // Gestion des erreurs
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEntretiens,
  getEntretien,
  createEntretien,
  updateEntretien,
  deleteEntretien,
  changeEntretienStatus,
};
