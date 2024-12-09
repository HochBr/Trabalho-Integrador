const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/fornecedor', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    fornecedorController.listarFornecedores);

router.post(
    '/fornecedor', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    fornecedorController.adicionarFornecedor);

router.put(
    '/fornecedor/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    fornecedorController.editarFornecedor);

router.delete(
    '/fornecedor/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    fornecedorController.excluirFornecedor);

module.exports = router;