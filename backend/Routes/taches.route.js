const express = require("express")
const router = express.Router();
const tacheController = require("../controllers/taches.controller.js")




router.get('/get', tacheController.getTaches);
router.get('/get/:id', tacheController.getTache);
router.post('/create', tacheController.createTache);  // Assurez-vous que la route est définie comme ceci
router.put('/update/:id', tacheController.updateTache);
router.delete('/delete/:id', tacheController.deleteTache);
module.exports = router