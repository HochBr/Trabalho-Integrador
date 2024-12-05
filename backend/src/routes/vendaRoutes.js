const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/vendaController');

// Rotas
router.get('/venda', protudoController.listarVendas);
router.post('/venda', protudoController.adicionarVenda);
router.put('/venda/:id', protudoController.editarVenda);
router.delete('/venda/:id', protudoController.excluirVenda);

module.exports = router;