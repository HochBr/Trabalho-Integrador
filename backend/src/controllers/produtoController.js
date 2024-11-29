//Funções CRUD para os produtos
const db = require('../config/db');

exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await db.query('SELECT * from produto');
        console.log('Retornando todos os produtos.');
        res.json(produtos).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}
