CREATE TABLE IF NOT EXISTS Fornecedor (
    CNPJ CHAR(14) PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Endereco VARCHAR(255),
    Email VARCHAR(255),
    Telefone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Categoria (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Produto (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Valor DECIMAL(10, 2) NOT NULL,
    Marca VARCHAR(255),
    CategoriaID INT,
    FornecedorCNPJ CHAR(14) NOT NULL,
    FOREIGN KEY (CategoriaID) REFERENCES Categoria(ID),
    FOREIGN KEY (FornecedorCNPJ) REFERENCES Fornecedor(CNPJ)
);

--Inserções testes
INSERT INTO Fornecedor (CNPJ, Nome, Endereco, Email, Telefone) VALUES
('11222333000101', 'Gás Mais Barato Ltda', 'Rua Principal, 123', 'contato@gasmaisbarato.com', '(11) 99999-1111'),
('33444555000122', 'Super Gás Distribuidora', 'Av. Central, 456', 'vendas@supergas.com', '(21) 88888-2222');

INSERT INTO Categoria (Nome) VALUES
('Gás de Cozinha'),
('Gás Industrial'),
('Acessórios para Gás');

INSERT INTO Produto (Nome, Valor, Marca, CategoriaID, FornecedorCNPJ) VALUES
('Botijão de 13kg', 120.00, 'Ultragaz', 1, '11222333000101'),
('Botijão de 45kg', 450.00, 'Liquigás', 2, '33444555000122'),
('Mangueira para Gás', 30.00, 'Top Gás', 3, '11222333000101'),
('Regulador de Pressão', 60.00, 'Gás Control', 3, '33444555000122');
