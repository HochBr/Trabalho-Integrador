//Funções CRUD para os produtos
const db = require('../config/db');

exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await db.any('SELECT * from produto');
        console.log('Retornando todos os produtos.');
        res.json(produtos).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.adicionarProduto = async(req, res) => {
    try {
        const {id, nome, valor, marca, CategoriaID, fornecedorCNPJ} = req.body;
        console.log(req.body);
        console.log('Query para inserção:', 
            'INSERT INTO produto (id, nome, valor, marca, CategoriaID, fornecedorCNPJ) VALUES ($1, $2, $3, $4, $5, $6)', 
            [id, nome, valor, marca, CategoriaID, fornecedorCNPJ]
        );
        await db.none(
            'INSERT INTO produto (id, nome, valor, marca, CategoriaID, fornecedorCNPJ) VALUES ($1, $2, $3, $4, $5, $6)', 
            [id, nome, valor, marca, CategoriaID, fornecedorCNPJ]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.excluirProduto = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none('DELETE FROM produto WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover produto', error);
        res.sendStatus(500);
    }
}