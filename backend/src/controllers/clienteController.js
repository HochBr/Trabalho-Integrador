//Funções CRUD para os clientes
const db = require('../config/db');

exports.listarClientes = async (req, res) => {
    try {
        const clientes = await db.any('SELECT * from cliente');
        console.log('Retornando todos os clientes.');
        res.json(clientes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
} 

exports.adicionarCliente = async(req, res) => {
    try {
        const {nome, endereco, saldo, contato} = req.body;
        console.log(req.body);
        console.log('Query para inserção:', 
            'INSERT INTO cliente (nome, endereco, saldo, contato) VALUES ($1, $2, $3, $4)', 
            [nome, endereco, saldo, contato]
        );
        await db.none(
            'INSERT INTO cliente (nome, endereco, saldo, contato) VALUES ($1, $2, $3, $4)', 
            [nome, endereco, saldo, contato]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.excluirCliente = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none('DELETE FROM cliente WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) { 
        console.error('Erro ao remover cliente', error);
        res.sendStatus(500);
    }
}

exports.editarCliente = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, endereco, saldo, contato} = req.body;
        console.log(`Id recebito para atualizar: ${id} `);
        await db.none(
            'UPDATE cliente SET nome = $1, endereco = $2, saldo = $3, contato = $4 WHERE id = $5', 
            [nome, endereco, saldo, contato, id]);
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover cliente', error);
        res.sendStatus(500);
    }
}
