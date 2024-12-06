const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, restrictAccess } = require("../middlewares/authMiddleware");
const passport = require('passport');

// Rotas
router.get('/user', userController.listarUsuarios);
router.post('/user', userController.adicionarUsuario);
router.put('/user/:id', userController.editarUsuario);
router.delete('/user/:id', userController.excluirUsuario);

module.exports = router;