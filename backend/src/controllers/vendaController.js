//Funções CRUD para os vendas
const db = require("../config/db");

exports.listarVendas = async (req, res) => {
    try {
        const vendas = await db.any(`
            SELECT v.id, p.nome as "nome cliente", p.valor as "Valor unitário", 
            vp.quantidade, v.datavenda as "Data da venda", c.nome as Cliente, 
            (vp.quantidade * p.valor) as Total 
            FROM produto p JOIN venda_produto vp on p.id = vp.idproduto 
            JOIN venda v on vp.idvenda=v.id 
            LEFT JOIN cliente c ON v.idcliente = c.id
        `);
        console.log("Retornando todas as vendas.");
        res.json(vendas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

exports.adicionarVenda = async (req, res) => {
    try {
        const { id, nome } = req.body;
        console.log(req.body);
        console.log(
            "Query para inserção:",
            "INSERT INTO venda (nome) VALUES ($1)",
            [nome]
        );
        await db.none("INSERT INTO venda (nome) VALUES ($1)", [nome]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.excluirVenda = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.none("DELETE FROM venda WHERE id = $1", [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error("Erro ao remover venda", error);
        res.sendStatus(500);
    }
};

exports.editarVenda = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, valor, marca, VendaID, fornecedorCNPJ } = req.body;
        console.log(`Id recebito para atualizar: ${id} `);
        await db.none("UPDATE venda SET nome = $1 WHERE id = $2", [nome, id]);
        res.sendStatus(200);
    } catch (error) {
        console.error("Erro ao remover venda", error);
        res.sendStatus(500);
    }
};
