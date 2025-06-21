const express = require('express');
const multer = require('multer');
const candidatureController = require('../controllers/CandidatureContr');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', candidatureController.getAllCandidatures);
router.post('/', upload.fields([{ name: 'cv' }, { name: 'lettreDeMotivation' }]), candidatureController.saveCandidature);
router.get('/:id', candidatureController.getCandidatureById);
router.put('/:id', upload.fields([{ name: 'cv' }, { name: 'lettreDeMotivation' }]), candidatureController.updateCandidature);
router.delete('/:id', candidatureController.deleteCandidature);
router.get('/:id/download/cv', candidatureController.downloadCV);
router.get('/:id/download/lettreDeMotivation', candidatureController.downloadLettreDeMotivation);


module.exports = router;