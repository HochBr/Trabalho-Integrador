const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/produto',
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.listarProdutos
);

router.post(
    '/produto', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    protudoController.adicionarProduto

);
router.put(
    '/produto/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    protudoController.editarProduto
);
router.delete(
    '/produto/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    protudoController.excluirProduto
);
router.get(
    '/produto/countcategoria', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.categoriasProdutoCOUNT);

router.get(
    '/produto/sumcategoria', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.getVendasPorTempo);

router.get(
    '/produto/diamais', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.getDiaMaisVendido);

router.get(
    '/produto/diamenos', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.getDiaMenosVendido);

router.get(
    '/produto/total', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.total);

router.get(
    '/produto/media',
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    protudoController.media);

module.exports = router; 