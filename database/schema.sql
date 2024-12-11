CREATE DATABASE transportesbotezini;

\c transportesbotezini;

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
('12345678000101', 'Fornecedor A',                'Rua Central, 123',                        'contato@fornecedorA.com',                '11987654321'),
('98765432000199', 'Fornecedor B',                'Avenida Sul, 456',                        'contato@fornecedorB.com',                '11912345678'),
('32165487000133', 'Fornecedor C',                'Praça Norte, 789',                        'contato@fornecedorC.com',                '11965498732'),
('91339754000126', 'Ester e Josefa Ltda',         'Rua do Granito, 292',                     'cobranca@esterejosefaltda.com.br',       '11981427210'),
('96182897000190', 'Arthur e Marcelo ME',         'Rua Antônio Gonçalves Requito, 243',      'representantes@arthuremarcelome.com.br', '11987518945'),
('46230001000123', 'Clara e Melissa ME',          'Estrada da Fazenda Velha, 115',           'diretoria@claraemelissame.com.br',       '17984566753'),
('88067339000156', 'Alícia e Pietro Ltda',        'Avenida Josué Di Bernardi, 645',          'representantes@aliciaepietroltda.com.br','48999800700'),
('60171777000140', 'Kaique e Marli ME',           'Rua Padre Antônio, 285',                  'juridico@kaiqueemarli.com.br',           '47998755988'),
('49144726000197', 'Clarice e Fátima ME',         'Rua Minas Gerais, 590',                   'auditoria@clariceefatimame.com.br',      '48994279780'),
('59702799000100', 'Breno e Benjamin ME',         'Rua das Orquídeas, 842',                  'seguranca@brenoebenjaminme.com.br',      '48998074530'),
('69007841000127', 'Benedita e Bryan Telas Ltda', 'Servidão Ondina Santos de Jesus, 156',    'fiscal@beneditaebryantelasltda.com.br',  '48988237571'),
('36874341000133', 'Allana e Liz Ltda',           'Rua Conselheiro Pedro Bortoloto 78, 548', 'suporte@allanaelizltda.com.br',          '48983968950');



-- Categorias
INSERT INTO categoria (Nome)
VALUES 
('Gás Residencial'),
('Gás Industrial'),
('Acessórios de Gás');


-- Produtos
INSERT INTO produto (ID, Nome, Valor, Marca, CategoriaID, FornecedorCNPJ, Estoque)
VALUES 
(1, 'Botijão de Gás P13', 120.00, 'Nacional Gás', 1, '12345678000101', 50),
(2, 'Botijão de Gás P45', 420.00, 'Nacional Gás', 2, '98765432000199', 20),
(3, 'Mangueira de Gás',    25.00, 'Marca C',      3, '32165487000133', 100),
(4, 'Registro de Gás',     50.00, 'Marca C',      3, '32165487000133', 75),
(5, 'Botijão de Gás P2',   60.00 ,'Nacional Gás', 1, '88067339000156', 5),
(6, 'Botijão de Gás P5',   80.00 ,'Nacional Gás', 1, '36874341000133', 5),
(7, 'Botijão de Gás P8',  100.00 ,'Nacional Gás', 1, '60171777000140', 10),
(8, 'Botijão de Gás P20', 230.00 ,'Nacional Gás', 2, '91339754000126', 4),
(9, 'Botijão de Gás P13', 120.00, 'Liquigás',     1, '12345678000101', 50),
(10,'Botijão de Gás P20', 220.00, 'Liquigás',     1, '12345678000101', 50),
(11,'Casco P13',          320.00, 'Nacional Gás', 3, '88067339000156', 90);



-- Clientes
INSERT INTO cliente (Nome, Endereco, Saldo, Contato)
VALUES 
('João da Silva',   'Rua dos Lírios, 789',             0.00,  '11999999999'),
('Maria Oliveira',  'Avenida das Rosas, 101',          0.00,  '11988888888'),
('Pedro Santos',    'Rua dos Cravos, 202',             0.00,  '11977777777'),
('Ana Paula',       'Avenida das Hortênsias, 303',     0.00,  '11966666666'),
('Benedito Filipe', 'Rua Rui Barbosa, 810',            120.00,'49996045148'),
('Clara Antonella', 'Rua Pascoal Moro, 383',           240.00,'49996300965'),
('Bernardo Murilo', 'Rua Visconde de Mauá, 896',       160.00,'49997868011'),
('Rebeca Yasmin',   'Rua Alécio Alexandre Cella, 883', 0.00,  '49993702060'),
('Rayssa Cláudia',  'Rua Rui Barbosa, 282',            120.00,'49985732439'),
('Luiza Emanuelly', 'Rua Emílio Zandavalli, 695',      240.00,'49994018736'),
('Julio Erick',     'Avenida Porto Alegre, 152',       160.00,'49989265808'),
('Arthur João',     'Travessa Amilcore Sutilli, 936',  0.00,  '49983418383');

-- Aquisições
INSERT INTO aquisicao (dtcompra)
VALUES 
('01/11/2024'),
('15/11/2024'),
('20/11/2024'),
('21/11/2024'),
('25/11/2024'),
('27/11/2024'),
('28/11/2024'),
('02/12/2024'),
('04/12/2024'),
('05/12/2024');

-- Aquisição_Produto
INSERT INTO aquisicao_produto (idproduto, idaquisicao, precocompra, vencimento, quantidade)
VALUES 
(1, 1, 90.00, '01/11/2024', 100),
(2, 1, 280.00,'01/12/2024', 50),
(3, 2, 20.00, '15/11/2024', 200),
(4, 3, 45.00, '20/11/2024', 150),
(5, 4, 20.00, '30/11/2024', 40),
(6, 5, 35.00, '30/11/2024', 30),
(7, 6, 50.00, '05/12/2024', 4),
(8, 7, 70.00, '05/12/2024', 25),
(9, 8, 85.00, '10/12/2024', 70),
(10,9, 180.00,'20/12/2024', 90);

-- Vendas
INSERT INTO venda (idcliente, datavenda)
VALUES 
(1, '20/11/2024'), 
(2, '25/11/2024'),
(3, '30/11/2024'),
(4, '05/12/2024'),
(5, '05/12/2024'),
(6, '05/12/2024'),
(7, '06/12/2024'),
(8, '06/12/2024'),
(9, '06/12/2024'),
(10,'07/12/2024');

-- Venda_Produto
INSERT INTO venda_produto (idproduto, idvenda, quantidade)
VALUES 
(1, 1,  2),
(2, 2,  1),
(3, 3,  5),
(4, 4,  3),
(1, 5,  2),
(2, 6,  5),
(3, 7,  7),
(5, 8,  3),
(6, 9,  6),
(7, 10, 8);


-- Usuários
INSERT INTO usuario (username, nome, senha, tipousuario)
VALUES 
('Administrador', 'Jedilson', '$2b$10$K1Qc.rg2Yc29nYz9PzL9cu3UhuhdxFSR51Ky64n.J.FqUiJ.sTiDe', 'Administrador'),
('Visualizador', 'Joana Souza', '$2b$10$3y.y8oPcvSn2u1DyMPVVmeXqtT3U6bL79D7ib1p9FpoQ9/FQ6O3eS', 'Visualizador'),
('admin', 'admin', '$2b$10$kOBcf8nWfksnOh1aYuqjP.125NBiMoECt3R5xWqt9IsLRD7dttTy.', 'Administrador'),
('olha2', 'olha2', '$2b$10$WO6lz8F52jrGe0URJJrrwOwPhBH6Bhd0vmzmnEkWoEfu7o5KEgcdi', 'Visualizador');
