const express = require('express');
const offreController = require('../controllers/OffreContr');
const router = express.Router();

router.get('/', offreController.getAll);
router.post('/', offreController.saveOffre);
router.get('/:id', offreController.getById);
router.delete('/:id', offreController.deleteOffre);
router.put('/:id', offreController.updateOffre);
router.get('/candidats/:id', offreController.getCandidatsFromIdOffre);

module.exports = router;
