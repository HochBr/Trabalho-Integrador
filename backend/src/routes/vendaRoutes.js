const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');

// Rotas
router.get('/venda', vendaController.listarVendas);
router.post('/venda', vendaController.adicionarVenda);
router.put('/venda/:idvenda', vendaController.editarVenda);
router.delete('/venda/:idvenda', vendaController.excluirVenda);

module.exports = router;