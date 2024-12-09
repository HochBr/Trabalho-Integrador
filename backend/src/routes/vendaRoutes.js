const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/venda', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    vendaController.listarVendas);

router.post(
    '/venda', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    vendaController.adicionarVenda);

router.put(
    '/venda/:idvenda', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    vendaController.editarVenda);

router.delete(
    '/venda/:idvenda', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    vendaController.excluirVenda);

module.exports = router;