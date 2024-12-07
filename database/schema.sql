CREATE TABLE IF NOT EXISTS Fornecedor (
    CNPJ VARCHAR(14) PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Endereco VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Telefone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Categoria (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Produto (
    ID INT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    Marca VARCHAR(255) NOT NULL,
    CategoriaID INT,
    FornecedorCNPJ VARCHAR(14),
    Estoque INT NOT NULL,
    FOREIGN KEY (CategoriaID) REFERENCES Categoria(ID) ON DELETE SET NULL,
    FOREIGN KEY (FornecedorCNPJ) REFERENCES Fornecedor(CNPJ) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Aquisicao (
    ID SERIAL PRIMARY KEY,
    dtcompra date NOT NULL
);


CREATE TABLE IF NOT EXISTS Cliente (
    ID SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    saldo DECIMAL (10, 2) NOT NULL,
    contato VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS aquisicao_produto (
    idproduto INT,
    idaquisicao INT,
    precocompra DECIMAL (10, 2) NOT NULL,
    vencimento DATE NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (idproduto) REFERENCES Produto(ID) ON DELETE SET NULL,
    FOREIGN KEY (idaquisicao) REFERENCES Aquisicao(ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Venda (
    id SERIAL PRIMARY KEY,
    idcliente INT,
    datavenda DATE NOT NULL,
    FOREIGN KEY (idcliente) REFERENCES Cliente(ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS venda_produto (
    idproduto INT,
    idvenda INT,
    quantidade INT NOT NULL,
    FOREIGN KEY (idproduto) REFERENCES Produto(ID) ON DELETE SET NULL,
    FOREIGN KEY (idvenda) REFERENCES Venda(ID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Usuario (
    username VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipousuario VARCHAR(255) NOT NULL
);

--Inserções testes
-- Configurar formato de data na sessão atual
SET datestyle = 'ISO, DMY';

-- Fornecedores
INSERT INTO fornecedor (CNPJ, Nome, Endereco, Email, Telefone)
VALUES 
('12345678000101', 'Fornecedor A', 'Rua Central, 123', 'contato@fornecedorA.com', '11987654321'),
('98765432000199', 'Fornecedor B', 'Avenida Sul, 456', 'contato@fornecedorB.com', '11912345678'),
('32165487000133', 'Fornecedor C', 'Praça Norte, 789', 'contato@fornecedorC.com', '11965498732');

-- Categorias
INSERT INTO categoria (Nome)
VALUES 
('Gás Residencial'),
('Gás Industrial'),
('Acessórios de Gás');

-- Produtos
INSERT INTO produto (ID, Nome, Valor, Marca, CategoriaID, FornecedorCNPJ, Estoque)
VALUES 
(1, 'Botijão de Gás P13', 100.00, 'Marca A', 1, '12345678000101', 50),
(2, 'Botijão de Gás P45', 300.00, 'Marca B', 2, '98765432000199', 20),
(3, 'Mangueira de Gás', 25.00, 'Marca C', 3, '32165487000133', 100),
(4, 'Registro de Gás', 50.00, 'Marca C', 3, '32165487000133', 75);

-- Clientes
INSERT INTO cliente (Nome, Endereco, Saldo, Contato)
VALUES 
('João da Silva', 'Rua dos Lírios, 789', 0.00, '11999999999'),
('Maria Oliveira', 'Avenida das Rosas, 101', 0.00, '11988888888'),
('Pedro Santos', 'Rua dos Cravos, 202', 0.00, '11977777777'),
('Ana Paula', 'Avenida das Hortênsias, 303', 0.00, '11966666666');

-- Aquisições
INSERT INTO aquisicao (dtcompra)
VALUES 
('01/11/2024'),
('15/11/2024'),
('20/11/2024');

-- Aquisição_Produto
INSERT INTO aquisicao_produto (idproduto, idaquisicao, precocompra, vencimento, quantidade)
VALUES 
(1, 1, 90.00, '01/11/2025', 100),
(2, 1, 280.00, '01/12/2025', 50),
(3, 2, 20.00, '15/11/2025', 200),
(4, 3, 45.00, '20/11/2025', 150);

-- Vendas
INSERT INTO venda (idcliente, datavenda)
VALUES 
(1, '20/11/2024'), 
(2, '25/11/2024'),
(3, '30/11/2024'),
(4, '05/12/2024');

-- Venda_Produto
INSERT INTO venda_produto (idproduto, idvenda, quantidade)
VALUES 
(1, 1, 2),
(2, 2, 1),
(3, 3, 5),
(4, 4, 3);

-- Usuários
INSERT INTO usuario (username, nome, senha, tipousuario)
VALUES 
('Administrador', 'Jedilson', '$2b$10$K1Qc.rg2Yc29nYz9PzL9cu3UhuhdxFSR51Ky64n.J.FqUiJ.sTiDe', 'Administrador'),
('Visualizador', 'Joana Souza', '$2b$10$3y.y8oPcvSn2u1DyMPVVmeXqtT3U6bL79D7ib1p9FpoQ9/FQ6O3eS', 'Visualizador');

