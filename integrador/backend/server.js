const express = require('express');
const { rmSync } = require('fs');

const server = express(); // constante para não perder o servidor de besteira
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.listen(3000,() =>{console.log('servidor rodando')});
server.get('/',(req,res)=>{
    res.send('hello world')
});

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
    res.send(`${Produto_Nome} foi cadastrado com sucesso!`);
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
    const Produto =req.body.Produto;// produto vendido
    const Quantidade = parseInt(req.body.Quantidade); //quantos produtos iguais vendidos
    const Vendedor = req.body.Vendedor; //vendedores cadastrados
    /*
    planejar a lógica para adicionar mais de um produto no mesmo envio
    verificar o estoque para cada um dos envios e alertar os que não tiver o produto no estoque
    o valor total é só fazer a conta com o valor do produto e salvar no banco
    a data pega direto do sistema
    */
   res.send("Certo");
});

//#############################################################################################
server.post('/Menu/Fornecedor/Cadastro', (req,res)=>{
    const Fornecedor_Nome = req.body.Fornecedor_Nome;
    const Fornecedor_CNPJ = req.body.Fornecedor_CNPJ;
    const Fornecedor_Endereço = req.body.Fornecedor_Endereço;
    const Fornecedor_Telefone = req.body.Fornecedor_Telefone;
    const Fornecedor_Email = req.body.Fornecedor_Email;
    //Tratar casos de variaveis vazias
    //Tratar para evitar repetições
    res.send(`${Fornecedor_Nome} foi cadastrado com sucesso!`);
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
    let Compra_Data_Inicial = new Date();// não permitir + de 1 semana de atraso
    let Compra_Data_Vencimento = new Date(); // não permitir o vencimento ser antes da data inicial
    Compra_Data_Inicial =req.body.Compra_Data_Inicial;
    Compra_Data_Vencimento = req.body.Compra_Data_Vencimento;
    const Compra_Quantidade = req.body.Compra_Quantidade; // >0
    const Compra_Produto = req.body.Compra_Produto; 
    //Tratar casos de variaveis vazias
    res.send("Certo");
});
server.get('/Menu/Compras/Lista', (req,res)=>{
    //vai mostrar o historico das compras.
});