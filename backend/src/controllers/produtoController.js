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
        const {id, nome, valor, marca, CategoriaID, fornecedorCNPJ, estoque} = req.body;
        console.log(req.body);
        console.log('Query para inserção:', 
            'INSERT INTO produto (id, nome, valor, marca, CategoriaID, fornecedorCNPJ) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [id, nome, valor, marca, CategoriaID, fornecedorCNPJ, estoque]
        );
        await db.none(
            'INSERT INTO produto (id, nome, valor, marca, CategoriaID, fornecedorCNPJ, estoque) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [id, nome, valor, marca, CategoriaID, fornecedorCNPJ, estoque]);
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

exports.editarProduto = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, valor, marca, CategoriaID, fornecedorCNPJ} = req.body;
        console.log(`Id recebito para atualizar: ${id} `);
        await db.none(
            'UPDATE produto SET nome = $1, valor = $2, marca = $3, CategoriaID = $4, fornecedorCNPJ = $5 WHERE id = $6', 
            [nome, valor, marca, CategoriaID, fornecedorCNPJ, id]);
            res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao remover produto', error);
        res.sendStatus(500);
    }
}

//Para o Dashboard

exports.categoriasProdutoCOUNT = async (req, res) => {
    const { dataInicio, dataFim } = req.body; 
    try {
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: "Período de tempo não fornecido." });
        }
        const categorias = await db.any(
            `SELECT c.Nome, COUNT(*) AS quantidade 
             FROM Categoria c
             JOIN Produto p ON c.ID = p.CategoriaID 
             JOIN venda_produto vp ON p.ID = vp.idproduto 
             JOIN Venda v ON vp.idvenda = v.id
             WHERE p.DataCadastro BETWEEN $1 AND $2 
             GROUP BY c.Nome`,
            [dataInicio, dataFim] 
        );
        console.log('Retornando contagem de produtos por categoria.');
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};

exports.getSomaVendasPorCategoria = async (req, res) => {
    const { dataInicio, dataFim } = req.body; 
    try {
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: "Período de tempo não fornecido." });
        }
        const categorias = await db.any(
            `SELECT c.Nome AS categoria, SUM(vp.quantidade) AS total_vendas 
             FROM Categoria c
             JOIN Produto p ON c.ID = p.CategoriaID 
             JOIN venda_produto vp ON p.ID = vp.idproduto
             JOIN Venda v ON vp.idvenda = v.id
             WHERE v.datavenda BETWEEN $1 AND $2 
             GROUP BY c.Nome
             ORDER BY total_vendas DESC`,
            [dataInicio, dataFim] 
        );
        console.log('Soma de vendas por categoria retornada com sucesso.');
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};


exports.getVendasPorTempo = async (req, res) => {
    const { dataInicio, dataFim } = req.query;
    try {
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: "Período de tempo não fornecido." });
        }
        const vendas = await db.any(
            `SELECT v.datavenda::date AS dia, SUM(vp.quantidade) AS quantidade
             FROM venda_produto vp
             JOIN Venda v ON vp.idvenda = v.id
             WHERE v.datavenda BETWEEN $1 AND $2
             GROUP BY v.datavenda::date
             ORDER BY v.datavenda::date`,
            [dataInicio, dataFim]
        );
        res.status(200).json(vendas);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

exports.getDiaMaisVendido = async (req, res) => {
    const { dataInicio, dataFim } = req.query; // Mude para req.query
    try {
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: "Período de tempo não fornecido." });
        }

        const diaMaisVendido = await db.oneOrNone(
            `SELECT v.datavenda AS Dia, SUM(vp.quantidade) AS TotalVendido
             FROM venda AS v 
             JOIN venda_produto AS vp ON v.id = vp.idvenda
             WHERE v.datavenda BETWEEN $1 AND $2  
             GROUP BY v.datavenda
             ORDER BY TotalVendido DESC
             LIMIT 1;`,
            [dataInicio, dataFim]
        );

        if (!diaMaisVendido) {
            return res.status(404).json({ error: "Nenhum dado encontrado para o período especificado." });
        }

        console.log('Dia mais vendido retornado com sucesso.');
        res.status(200).json(diaMaisVendido);
    } catch (error) {
        console.error('Erro ao buscar o dia mais vendido:', error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};

exports.getDiaMenosVendido = async (req, res) => {
    const { dataInicio, dataFim } = req.query; // Mude para req.query
    try {
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: "Período de tempo não fornecido." });
        }

        const diaMenosVendido = await db.oneOrNone(
            `SELECT v.datavenda AS Dia, SUM(vp.quantidade) AS TotalVendido
             FROM venda AS v 
             JOIN venda_produto AS vp ON v.id = vp.idvenda
             WHERE v.datavenda BETWEEN $1 AND $2  
             GROUP BY v.datavenda
             ORDER BY TotalVendido ASC
             LIMIT 1;`,
            [dataInicio, dataFim]
        );

        if (!diaMenosVendido) {
            return res.status(404).json({ error: "Nenhum dado encontrado para o período especificado." });
        }

        console.log('Dia menos vendido retornado com sucesso.');
        res.status(200).json(diaMenosVendido);
    } catch (error) {
        console.error('Erro ao buscar o dia menos vendido:', error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};

exports.total = async (req, res) => {
    const { dataInicio, dataFim } = req.query;
  
    // Verifica se as datas foram fornecidas
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: 'As datas de início e fim são necessárias.' });
    }
  
    try {
      // Consulta SQL para calcular o total de produtos vendidos
      const total = await db.oneOrNone(`
        SELECT SUM(vp.quantidade) AS totalVendido
        FROM venda_produto vp
        JOIN venda v ON vp.idvenda = v.id
        WHERE v.datavenda BETWEEN $1 AND $2;
      `, [dataInicio, dataFim]);
  
      console.log('Resultado da consulta:', total);
      res.json(total);  // Verifique o que está sendo retornado aqui
        console.log("antes do if");
      // Verifica se o total vendido foi encontrado
      if (!total || total.totalVendido === null) {
        return res.status(404).json({ message: 'Nenhum produto foi vendido neste período.' });
      }
      console.log("antes do total vendido");
      // Retorna o total de produtos vendidos
    //   res.json({ total: total.totalVendido });
    } catch (error) {
      console.error('Erro ao buscar o total de vendas:', error);
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  };

  //média
  exports.media = async (req, res) => {
    const { dataInicio, dataFim } = req.query;
  
    // Verifica se as datas foram fornecidas
    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: 'As datas de início e fim são necessárias.' });
    }
  
    try {
      // Consulta SQL para calcular a média de produtos vendidos
      const media = await db.oneOrNone(`
        SELECT ROUND(AVG(vp.quantidade),2) AS mediaVendido
        FROM venda_produto vp
        JOIN venda v ON vp.idvenda = v.id
        WHERE v.datavenda BETWEEN $1 AND $2;
      `, [dataInicio, dataFim]);
  
      console.log('Resultado da consulta:', media);
      res.json(media);  // Verifique o que está sendo retornado aqui
        console.log("antes do if");
      // Verifica se o media vendido foi encontrado
      if (!media || media.mediaVendido === null) {
        return res.status(404).json({ message: 'Nenhum produto foi vendido neste período.' });
      }
      console.log("antes do media vendido");
      // Retorna o media de produtos vendidos
    //   res.json({ media: v.mediaVendido });
    } catch (error) {
      console.error('Erro ao buscar o media de vendas:', error);
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  };
  
  