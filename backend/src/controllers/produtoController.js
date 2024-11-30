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
        const {id, nome, valor, marca, CategoriaID, FornecedorCNPJ} = req.body;

        await db.none(
            'INSERT INTO produto (id, nome, valor, marca, CategoriaID, FornecedorCNPJ) VALUES ($1, $2, $3, $4, $5, $6)', 
            [id, nome, valor, marca, CategoriaID, FornecedorCNPJ]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}