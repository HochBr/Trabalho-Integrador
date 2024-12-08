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
router.get('/produto/countcategoria', protudoController.categoriasProdutoCOUNT);
router.get('/produto/sumcategoria', protudoController.getVendasPorTempo);
router.get('/produto/diamais', protudoController.getDiaMaisVendido);
router.get('/produto/diamenos', protudoController.getDiaMenosVendido);
router.get('/produto/total', protudoController.total);

module.exports = router; 