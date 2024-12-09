const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rotas
router.get('/cliente', clienteController.listarClientes);
router.post('/cliente', clienteController.adicionarCliente);
router.put('/cliente/:id', clienteController.editarCliente);
router.delete('/cliente/:id', clienteController.excluirCliente);

module.exports = router;  