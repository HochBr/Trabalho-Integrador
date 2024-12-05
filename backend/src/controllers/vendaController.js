//Funções CRUD para os vendas
const db = require("../config/db");

exports.listarVendas = async (req, res) => {
    try {
        const vendas = await db.any(`
            SELECT v.id, p.nome as produto, p.valor as "Valor unitário", 
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
        const { idcliente, datavenda, idproduto, quantidade} = req.body;
        console.log(req.body);
        console.log(
            "Query para inserção:",
            `INSERT INTO venda (idcliente, datavenda) VALUES ($1, $2)`, 
            [idcliente, datavenda]
        );
        await db.tx(async (t) => {
            const produto = await t.one(
                `SELECT valor, estoque FROM produto WHERE id = $1`,
                [idproduto]
            );

            if(produto.estoque < quantidade){
                throw new Error("Estoque insuficiente");
            }

            const valortotal = produto.valor * quantidade;

            const venda = await t.one(
                `INSERT INTO venda (idcliente, datavenda) VALUES ($1, $2) RETURNING id`, 
                [idcliente || null, datavenda]
            );
            if(idcliente) {
                await t.none(
                    `UPDATE cliente
                    SET saldo = saldo - $1
                    WHERE id = $2`,
                    [valortotal, idcliente]
                );
            }
            await t.none(
                `INSERT INTO venda_produto (idproduto, idvenda, quantidade)
                VALUES ($1, $2, $3)`,
                [idproduto, venda.id, quantidade]
            );
            await t.none(
                `UPDATE produto
                SET estoque = estoque - $1
                WHERE id = $2`,
                [quantidade, idproduto]
            );
        });
        res.status(201).send({message: "Venda realizada com sucesso!"});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.excluirVenda = async (req, res) => {
    try {
        const { idvenda } = req.params;
        console.log(`ID recebido para deletar: ${idvenda}`);
        await db.tx(async (t) => {
            const vendainfo = await t.oneOrNone(
                `SELECT v.idcliente, vp.idproduto, vp.quantidade, p.valor
                FROM venda v
                JOIN venda_produto vp on v.id = vp.idvenda
                JOIN produto p on vp.idproduto = p.id
                WHERE v.id = $1`,
                [idvenda]
            );
            if(!vendainfo) {
                throw new Error(`Venda com ID ${idvenda} não encontrada`);
            }

            const {idcliente, idproduto, quantidade, valor} = vendainfo;

            if(idcliente) {
                const valortotal = valor * quantidade;
                await t.none(
                    `UPDATE cliente
                    SET saldo = saldo + $1
                    WHERE id = $2`,
                    [valortotal, idcliente]
                );
            }
            await t.none(
                `UPDATE produto
                SET estoque = estoque + $1
                WHERE id = $2`,
                [quantidade, idproduto]
            );
            await t.none(
                `DELETE FROM venda_produto WHERE idvenda = $1`,
                [idvenda]
            );
            await t.none(
                `DELETE FROM venda WHERE id = $1`,
                [idvenda]
            );
        });
        res.status(200).send({message: "Venda excluída!"});
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
