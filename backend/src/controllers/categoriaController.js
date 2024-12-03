//Funções CRUD para os categorias
const db = require('../config/db');

exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await db.any('SELECT * from categoria');
        console.log('Retornando todos as categorias.');
        res.json(categorias).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.adicionarCategoria = async(req, res) => {
    try {
        const {id, nome} = req.body;
        console.log(req.body);
        console.log('Query para inserção:', 
            'INSERT INTO categoria (id, nome) VALUES ($1, $2)', 
            [id, nome]
        );
        await db.none(
            'INSERT INTO categoria (nome) VALUES ($1)', 
            [nome]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.excluirCategoria = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none('DELETE FROM categoria WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover categoria', error);
        res.sendStatus(500);
    }
}

exports.editarCategoria = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, valor, marca, CategoriaID, fornecedorCNPJ} = req.body;
        console.log(`Id recebito para atualizar: ${id} `);
        await db.none(
            'UPDATE categoria SET nome = $1 WHERE id = $2', 
            [nome, id]);
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover categoria', error);
        res.sendStatus(500);
    }
}