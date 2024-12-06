const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');

// Rotas
router.get('/fornecedor', fornecedorController.listarFornecedores);
router.post('/fornecedor', fornecedorController.adicionarFornecedor);
router.put('/fornecedor/:id', fornecedorController.editarFornecedor);
router.delete('/fornecedor/:id', fornecedorController.excluirFornecedor);

module.exports = router;