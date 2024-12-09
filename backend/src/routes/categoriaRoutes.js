const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get(
    '/categoria', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador', 'Visualizador']),
    categoriaController.listarCategorias);
router.post(
    '/categoria', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    categoriaController.adicionarCategoria);

router.put(
    '/categoria/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    categoriaController.editarCategoria);

router.delete(
    '/categoria/:id', 
    authMiddleware.authenticateJWT,
    authMiddleware.restrictAccess(['Administrador']),
    categoriaController.excluirCategoria);

module.exports = router;