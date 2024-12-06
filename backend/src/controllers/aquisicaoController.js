//Funções CRUD para os aquisicoes
const db = require('../config/db');

exports.listarAquisicoes = async (req, res) => {
    try {
        const aquisicoes = await db.any(
            `SELECT a.id, a.dtcompra, p.nome as produto, f.nome as fornecedor, ap.quantidade, ap.precocompra, ap.vencimento, ap.quantidade * ap.precocompra as total
            FROM aquisicao a 
            JOIN aquisicao_produto ap ON ap.idaquisicao = a.id
            JOIN produto p ON ap.idproduto = p.id
            JOIN fornecedor f on p.fornecedorcnpj = f.cnpj
            `
        );
        console.log('Retornando todos os aquisicoes.');
        res.json(aquisicoes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

exports.adicionarAquisicao = async (req, res) => {
    try {
        const { dtcompra, idproduto, quantidade, precocompra, vencimento } = req.body;
        await db.tx(async (t) => {
            const aquisicao = await t.one(
                `INSERT INTO aquisicao (dtcompra) VALUES ($1) RETURNING id`,
                [dtcompra]
            );

            const idAquisicao = aquisicao.id;

            await t.none(
                `INSERT INTO aquisicao_produto (idproduto, idaquisicao, precocompra, vencimento, quantidade)
                 VALUES ($1, $2, $3, $4, $5)`,
                [idproduto, idAquisicao, precocompra, vencimento, quantidade]
            );

            await t.none(
                `UPDATE produto
                 SET estoque = estoque + $1
                 WHERE id = $2`,
                [quantidade, idproduto]
            );
        });

        res.status(201).json({ message: "Aquisição registrada com sucesso!" });
    } catch (error) {
        console.error("Erro ao registrar aquisição:", error);
        res.status(500).json({
            error: "Erro ao registrar aquisição.",
        });
    }
}

exports.excluirAquisicao = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(`ID recebido para deletar: ${id}`);
        await db.tx(async (t) => {
            const aquisicaoinfo = await t.oneOrNone(
                `SELECT ap.idproduto, ap.quantidade
                FROM aquisicao_produto ap
                WHERE ap.idaquisicao = $1`,
                [id]
            );
            const {idproduto, quantidade} = aquisicaoinfo;
            await t.none(
                `UPDATE produto
                SET estoque = estoque - $1
                WHERE id = $2`,
                [quantidade, idproduto]
            );
            await t.none(
                `DELETE FROM aquisicao_produto
                WHERE idaquisicao = $1`,
                [id]
            );
            await t.none(
                `DELETE FROM aquisicao
                WHERE id = $1`,
                [id]
            );
        });
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover aquisicao', error);
        res.sendStatus(500);
    }
}

exports.editarAquisicao = async (req, res) => {
    try {
        const {id} = req.params;
        const {dtcompra, idproduto, quantidade, precocompra, vencimento} = req.body;
        console.log(`Id recebito para atualizar: ${id} `);
        await db.tx(async (t) => {
            const aquisicaoinfo = await t.oneOrNone(
                `SELECT ap.idproduto, ap.quantidade
                FROM aquisicao_produto ap
                WHERE ap.idaquisicao = $1`,
                [id]
            );
            if(!aquisicaoinfo){
                throw new Error(`Aquisição com ID: ${id} não encontrada`);
            }
            const {idproduto: oldProduto, quantidade: oldQtd} = aquisicaoinfo;
            if(oldProduto !== idproduto){
                await t.none(
                    `UPDATE produto
                    SET estoque = estoque - $1
                    WHERE id = $2`,
                    [oldQtd, oldProduto]
                );
                await t.none(
                    `UPDATE produto
                    SET estoque = estoque + $1
                    WHERE id = $2`,
                    [quantidade, idproduto]
                );
            } else {
                await t.none(
                    `UPDATE produto
                    SET estoque = estoque - $1 + $2
                    WHERE id = $3`,
                    [oldQtd, quantidade, idproduto]
                );
            }
            await t.none(
                `UPDATE aquisicao
                SET dtcompra = $1
                WHERE id = $2`,
                [dtcompra, id]
            );
            await t.none(
                `UPDATE aquisicao_produto
                SET idproduto = $1, quantidade = $2, precocompra = $3, vencimento = $4
                WHERE idaquisicao = $5`,
                [idproduto, quantidade, precocompra, vencimento, id]
            );
            console.log(`Aquisição com ID: ${id} atualizada com sucesso!`);
        });
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover aquisicao', error);
        res.sendStatus(500);
    }
}