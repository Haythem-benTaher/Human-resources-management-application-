// routes/entretien_router.js
const express = require('express');
const entretienController = require('../controllers/entretien_controller');



const router = express.Router();

router.get('/get', entretienController.getEntretiens);
router.get('/get/:id', entretienController.getEntretien);
router.post('/create',entretienController.createEntretien);
router.put('/update/:id', entretienController.updateEntretien);
router.delete('/delete/:id', entretienController.deleteEntretien);
router.patch('/update-status/:id', entretienController.changeEntretienStatus); // Route pour accepter ou refuser un entretien

module.exports = router;