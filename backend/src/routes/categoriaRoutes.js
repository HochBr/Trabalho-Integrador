const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Rotas
router.get('/categoria', categoriaController.listarCategorias);
router.post('/categoria', categoriaController.adicionarCategoria);
router.put('/categoria/:id', categoriaController.editarCategoria);
router.delete('/categoria/:id', categoriaController.excluirCategoria);

module.exports = router;