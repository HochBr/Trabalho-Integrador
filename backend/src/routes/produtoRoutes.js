const express = require('express');
const router = express.Router();
const protudoController = require('../controllers/produtoController');

// Rotas
router.get('/produto', protudoController.listarProdutos);
router.post('/produto', protudoController.adicionarProduto);
router.put('/produto/:id', protudoController.editarProduto);
router.delete('/produto/:id', protudoController.excluirProduto);
router.get('/produto/countcategoria', protudoController.categoriasProdutoCOUNT);
router.get('/produto/sumcategoria', protudoController.getVendasPorTempo);
router.get('/produto/diamais', protudoController.getDiaMaisVendido);
router.get('/produto/diamenos', protudoController.getDiaMenosVendido);

module.exports = router; 