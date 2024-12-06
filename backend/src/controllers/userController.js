//Funções CRUD para os usuarios
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await db.any('SELECT * from usuario');
        console.log('Retornando todos os usuarios.');
        res.json(usuarios).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.adicionarUsuario = async(req, res) => {
    try {
        const {username, nome, senha, tipousuario} = req.body;
        console.log(req.body);
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPasswd = bcrypt.hashSync(senha, salt);
        console.log('Query para inserção:', 
            'INSERT INTO usuario (username, nome, senha, tipousuario) VALUES ($1, $2, $3, $4)', 
            [username, nome, hashedPasswd, tipousuario]
        );
        await db.none(
            'INSERT INTO usuario (username, nome, senha, tipousuario) VALUES ($1, $2, $3, $4)', 
            [username, nome, hashedPasswd, tipousuario]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

exports.excluirUsuario = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none('DELETE FROM usuario WHERE username = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover usuario', error);
        res.sendStatus(500);
    }
}

exports.editarUsuario = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, senha, tipousuario} = req.body;
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPasswd = bcrypt.hashSync(senha, salt);
        console.log(`Id recebito para atualizar: ${id} `);
        await db.none(
            'UPDATE usuario SET nome = $1, senha = $2, tipousuario = $3 WHERE username = $4', 
            [nome, hashedPasswd, tipousuario, id]);
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover usuario', error);
        res.sendStatus(500);
    }
}
