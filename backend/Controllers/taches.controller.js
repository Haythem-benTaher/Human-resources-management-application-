const Taches = require('../models/taches.model');


// Fonction pour obtenir toutes les tâches
 const getTaches = async (req, res) => {
  try {
    const taches = await Taches.find({});
    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour obtenir une tâche spécifique
 const getTache = async (req, res) => {
  try {
    const { id } = req.params;
    const tache = await Taches.findById(id);
    if (!tache) {
      return res.status(404).json({ message: 'Tache not found' });
    }
    res.status(200).json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour créer une nouvelle tâche
 const createTache = async (req, res) => {
  try {
    const tache = await Taches.create(req.body);
    res.status(201).json(tache); // 201 Created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour mettre à jour une tâche existante
 const updateTache = async (req, res) => {
  try {
    const { id } = req.params;
    const tache = await Taches.findByIdAndUpdate(id, req.body, { new: true });

    if (!tache) {
      return res.status(404).json({ message: 'Tache not found' });
    }

    res.status(200).json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour supprimer une tâche
 const deleteTache = async (req, res) => {
 
    Taches.findByIdAndDelete(req.params.id)
      .then(() => res.status(200).json({ message: 'taches deleted' }))
      .catch(error => res.status(404).json({ error }));
  };
  module.exports = {
    createTache,
    deleteTache,
    getTache,
    getTaches,
    updateTache
  }
  