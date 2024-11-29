const express = require('express');
// const { rmSync } = require('fs');
const db = require("./config/db");
const cors = require('cors');
const produtoRoutes = require('./routes/produtoRoutes');

const server = express(); // constante para não perder o servidor de besteira
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/', produtoRoutes);

server.get("/test-db", async (req, res) => {
    try {
        const result = await db.any("SELECT 1 AS resultado");
        res.status(200).json({ message: "Conexão bem-sucedida!", result });
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        res.status(500).json({ message: "Erro ao conectar ao banco de dados.", error });
    }
});
let vetEstoque  = [];
let vetProdutos = [];
let vetFornecedores = [];
let vetVendas = [];
let vetCompras = [];
let vetClientes = [];
let vetVendedores = [];
let vetDevedores = [];

server.listen(3000,() =>{console.log('servidor rodando')});

server.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Aqui você pode adicionar a lógica de autenticação, como verificar no banco de dados
    if (username === 'user' && password === 'password') {
      // Se as credenciais estiverem corretas, envie uma resposta de sucesso
      res.json({ message: 'Login bem-sucedido', token: 'fake-jwt-token' });
    } else {
      // Caso contrário, envie uma resposta de erro
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
});
// "/Menu será o link da tala principal"

server.post('/Menu/Produto/Cadastro', (req,res)=>{
    const { Produto_Nome, Produto_Valor_Unt, Produto_Marca, Produto_Fornecedor, Produto_Categoria } = req.body;
    const produto = {
        Produto_Nome,
        Produto_Valor_Unt: parseFloat(Produto_Valor_Unt).toFixed(2),
        //tratar pra aceitar apenas numeros
        Produto_Marca,
        Produto_Fornecedor,
        //mostrar uma listas dos fornecedores já cadastrados
        Produto_Categoria
        // Lógica para verificar se alguma das variaveis está vazia
        // res.send(tais colunas estão vazias)
    }
    vetProdutos.push(produto)
    res.send(`${produto.Produto_Nome} foi cadastrado com sucesso!`);
});

server.get('/Menu/Produtos/Listar', (req, res) => {
    res.json(vetProdutos);
});
/*Dentro do catalogo deve aparecer para cada produto as opções de ATUALIZAR e DELETAR
  quando o usuário clicar para ver um produto especifico */
server.post('/Menu/CatalogoProduto/Atualizar', (req,res)=>{
    const Produto_Nome = req.body.Produto_Nome;
    const Produto_Valor_Unt = parseFloat(parseFloat(req.body.Produto_Valor_Unt).toFixed(2));
    //tratar pra aceitar apenas numeros
    const Produto_Marca = req.body.Produto_Marca;
    const Produto_Fornecedor = req.body.Produto_Fornecedor;
    //mostrar uma listas dos fornecedores já cadastrados
    const Produto_Categoria = req.body.Produto_Categoria;
    /*Lógica para verificar se alguma das variaveis está vazia
    res.send(tais colunas estão vazias)
    */
    res.send(`${Produto_Nome} foi atualizado com sucesso!`);
});
server.delete('/Menu/CatalogoProduto/Deletar',(req,res)=>{
    //método para deletar que ainda não foi aprendido
    //deve pedir se o usuário tem certeza antes de apagar
    res.send(`${Produto_Nome} foi apagado com sucesso!`);
});

//############################################################################################
server.post('/Menu/Vendas/Cadastro',(req, res)=> {
    const { Produto, Quantidade, Vendedor } = req.body;
    const venda = { Produto, Quantidade, Vendedor, Data: new Date() };
    /*
    planejar a lógica para adicionar mais de um produto no mesmo envio
    verificar o estoque para cada um dos envios e alertar os que não tiver o produto no estoque
    o valor total é só fazer a conta com o valor do produto e salvar no banco
    a data pega direto do sistema
    */
    vetVendasvendas.push(venda);
    res.send("Certo");
});
server.get('/Menu/Vendas/Listar', (req, res) => {
    res.json(vetVendas);
});
//#############################################################################################
server.post('/Menu/Fornecedor/Cadastro', (req,res)=>{
    const { Fornecedor_Nome, Fornecedor_CNPJ, Fornecedor_Endereço, Fornecedor_Telefone, Fornecedor_Email } = req.body;
    //Tratar casos de variaveis vazias
    //Tratar para evitar repetições
    const novoFornecedor = {
        Fornecedor_Nome,
        Fornecedor_CNPJ,
        Fornecedor_Endereço,
        Fornecedor_Telefone,
        Fornecedor_Email
    };

    vetFornecedores.push(novoFornecedor);
    res.send(`${Fornecedor_Nome} foi cadastrado com sucesso!`);
});

server.get('/Menu/Fornecedor/Listar', (req, res) => {
    res.json(vetFornecedores);
});

server.put('/Menu/Fornecedor/Atualizar', (req,res)=>{
    const Fornecedor_Nome = req.body.Fornecedor_Nome;
    const Fornecedor_CNPJ = req.body.Fornecedor_CNPJ;
    const Fornecedor_Endereço = req.body.Fornecedor_Endereço;
    const Fornecedor_Telefone = req.body.Fornecedor_Telefone;
    const Fornecedor_Email = req.body.Fornecedor_Email;
    //Tratar casos de variaveis vazias
    //Tratar para evitar repetições
    res.send(`${Fornecedor_Nome} foi atualizado com sucesso!`);
});
server.delete('/Menu/Fornecedor/Deletar',(req,res)=>{
    //método para deletar que ainda não foi aprendido
    //deve pedir se o usuário tem certeza antes de apagar
    res.send(`${Fornecedor_Nome} foi apagado com sucesso!`)
});

//###########################################################################################

server.post('/Menu/Compras/Cadastrar', (req, res)=>{
    const { Compra_Data_Inicial, Compra_Data_Vencimento, Compra_Quantidade, Compra_Produto } = req.body;
    const compra = { Compra_Data_Inicial, Compra_Data_Vencimento, Compra_Quantidade, Compra_Produto };
    //Tratar casos de variaveis vazias/invalidas
    vetCompras.push(compra);
    res.send("Certo");
});
server.get('/Menu/Compras/Lista', (req,res)=>{
    res.json(vetCompras);
});

server.post('/Menu/Estoque/Adicionar', (req, res)=> {
    // const{produtoId, quantidade} = req.body;
    const produtos = req.body;
    vetEstoque.push(produtos);
    res.json({message: `Produto ${produtos.produtoId} adicionado com quantidade ${produtos.quantidade}`});  
});

server.get('/Menu/Estoque/listar', (req, res) => {
    res.json(vetEstoque);
});