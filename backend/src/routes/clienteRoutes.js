const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/cliente', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    clienteController.listarClientes);

router.post(
    '/cliente', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    clienteController.adicionarCliente);

router.put(
    '/cliente/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    clienteController.editarCliente);

router.delete(
    '/cliente/:id',
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']), 
    clienteController.excluirCliente);

module.exports = router;  