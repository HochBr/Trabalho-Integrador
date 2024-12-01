const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/fornecedorController');

// Rotas
router.get('/fornecedor', protudoController.listarFornecedores);
router.post('/fornecedor', protudoController.adicionarFornecedor);
router.put('/fornecedor/:id', protudoController.editarFornecedor);
router.delete('/fornecedor/:id', protudoController.excluirFornecedor);

module.exports = router;