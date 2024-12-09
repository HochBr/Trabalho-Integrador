const express = require('express');
const router = express.Router();
const aquisicaoController = require('../controllers/aquisicaoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/aquisicao',
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    aquisicaoController.listarAquisicoes);
router.post(
    '/aquisicao', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    aquisicaoController.adicionarAquisicao);

router.put(
    '/aquisicao/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    aquisicaoController.editarAquisicao);

router.delete(
    '/aquisicao/:id',
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']), 
    aquisicaoController.excluirAquisicao);

module.exports = router;  