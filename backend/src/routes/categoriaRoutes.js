const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/categoriaController');

// Rotas
router.get('/categoria', protudoController.listarCategorias);
router.post('/categoria', protudoController.adicionarCategoria);
router.put('/categoria/:id', protudoController.editarCategoria);
router.delete('/categoria/:id', protudoController.excluirCategoria);

module.exports = router;