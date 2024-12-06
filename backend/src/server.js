const express = require('express');
// const { rmSync } = require('fs');
const db = require("./config/db");
const cors = require('cors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const LocalStrategy = require("passport-local");

const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const vendaRoutes = require('./routes/vendaRoutes');
const aquisicaoRoutes = require('./routes/aquisicaoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const server = express(); // constante para não perder o servidor de besteira
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(passport.initialize());

server.use('/', produtoRoutes);
server.use('/', categoriaRoutes);
server.use('/', fornecedorRoutes);
server.use('/', vendaRoutes);
server.use('/', aquisicaoRoutes);
server.use('/', clienteRoutes);
server.use('/', userRoutes);
server.use('/', authRoutes);

server.listen(3001,() =>{console.log('servidor rodando')});
