const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas
router.get('/user', userController.listarUsuarios);
router.post('/user', userController.adicionarUsuario);
router.put('/user/:id', userController.editarUsuario);
router.delete('/user/:id', userController.excluirUsuario);

module.exports = router;