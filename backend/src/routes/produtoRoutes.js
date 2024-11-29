const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/produtoController');

// Rotas
router.get('/produto', protudoController.listarProdutos);
// router.post('/produto', protudoController.adicionarProduto);
// router.put('/produto:id', protudoController.editarProduto);
// router.delete('/produto:id', protudoController.excluirProduto);

module.exports = router;