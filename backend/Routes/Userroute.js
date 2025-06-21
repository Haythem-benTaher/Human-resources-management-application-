const express = require("express")
const router = express.Router()

const UserController = require("../controllers/Usercontroller")
const upload = require("../middleware/upload")
router.get('/' , UserController.consulter)
router.post('/consulter' , UserController.consulterID)
router.post('/register' ,upload.single('image') , UserController.signup )
router.post('/login', UserController.login)
router.post('/modifier' ,upload.single('image'),  UserController.modifier)
router.delete('/supprimer' , UserController.supprimer)
module.exports = router