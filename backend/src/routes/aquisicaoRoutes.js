const express = require('express');
const router = express.Router();
const aquisicaoController = require('../controllers/aquisicaoController');

// Rotas
router.get('/aquisicao', aquisicaoController.listarAquisicoes);
router.post('/aquisicao', aquisicaoController.adicionarAquisicao);
router.put('/aquisicao/:id', aquisicaoController.editarAquisicao);
router.delete('/aquisicao/:id', aquisicaoController.excluirAquisicao);

module.exports = router;