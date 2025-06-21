const Offre = require('../models/Offre');

const getAll = (req, res, next) => {
  Offre.find()
    .then(offres => res.status(200).json(offres))
    .catch(error => res.status(400).json({ error }));
}

const getById = (req, res, next) => {
  Offre.findOne({ _id: req.params.id })
    .then(offre => res.status(200).json({ offre }))
    .catch(error => res.status(404).json({ error }));
}

const saveOffre = (req, res, next) => {
  const offre_ajoutee = new Offre(req.body);
  
  offre_ajoutee.save()
    .then(offre => {
      res.status(200).json({ offre });
      console.log('Offre created');
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
}

const deleteOffre = (req, res, next) => {
  let id = req.params.id;
  
  Offre.findByIdAndDelete(id)
    .then(result => {
      res.json({ message: 'Offre Deleted' });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
}

const updateOffre = (req, res, next) => {
  let offre_ajoutee = req.body;

  Offre.findByIdAndUpdate(req.params.id, offre_ajoutee, { new: true })
    .then(offre => {
      res.status(200).json(offre);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
}

const getCandidatsFromIdOffre = (req, res) => {
  let id = req.params.id;
  
  Offre.findById(id)
    .then(resultat => {
      res.send(resultat.candidats);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ error: err });
    });
}

module.exports = {
  saveOffre,
  getAll,
  getById,
  deleteOffre,
  updateOffre,
  getCandidatsFromIdOffre
}
