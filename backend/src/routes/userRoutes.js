const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, restrictAccess } = require("../middlewares/authMiddleware");
const passport = require('passport');
const authMiddleware = require('../middlewares/authMiddleware');


// Rotas
router.get(
    '/user', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    userController.listarUsuarios);

router.post(
    '/user', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    userController.adicionarUsuario);

router.put(
    '/user/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    userController.editarUsuario);
router.delete(
    '/user/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    userController.excluirUsuario);

module.exports = router;