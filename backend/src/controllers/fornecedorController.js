//Funções CRUD para os fornecedores
const db = require('../config/db');

exports.listarFornecedores = async (req, res) => {
    try {
        const fornecedores = await db.any('SELECT * from fornecedor');
        console.log('Retornando todos os fornecedores.');
        res.json(fornecedores).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.adicionarFornecedor = async(req, res) => {
    try {
        const {cnpj, nome, endereco, email, telefone} = req.body;
        console.log(req.body);
        console.log('Query para inserção:', 
            'INSERT INTO fornecedor (cnpj, nome, endereco, email, telefone) VALUES ($1, $2, $3, $4, $5)', 
            [cnpj, nome, endereco, email, telefone]
        );
        await db.none(
            'INSERT INTO fornecedor (cnpj, nome, endereco, email, telefone) VALUES ($1, $2, $3, $4, $5)', 
            [cnpj, nome, endereco, email, telefone]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.excluirFornecedor = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none('DELETE FROM fornecedor WHERE cnpj = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover fornecedor', error);
        res.sendStatus(500);
    }
}

exports.editarFornecedor = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, endereco, email, telefone} = req.body;
        console.log(`CNPJ recebito para atualizar: ${id} `);
        await db.none(
            'UPDATE fornecedor SET nome = $1, endereco = $2, email = $3, telefone = $4 WHERE cnpj = $5', 
            [nome, endereco, email, telefone, id]);
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover fornecedor', error);
        res.sendStatus(500);
    }
}