import React, { useRef } from 'react';
import Login from './componentes/pages/TelaGeral/Login.js';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './componentes/pages/Home.jsx';
//CRUDS principais
import CadastroFornecedor from './componentes/pages/Cadastros/CadastroFornecedor.jsx';
import CadastroVendas from './componentes/pages/Cadastros/CadastroVendas.jsx';
import CadastroProduto from './componentes/pages/Cadastros/CadastroProduto.jsx';
import CadastroCategoria from './componentes/pages/Cadastros/CadastroCategorias.jsx';
import CadastroCompra from './componentes/pages/Cadastros/CadastroCompra.jsx';
import CadastroCliente from './componentes/pages/Cadastros/CadastroCliente.jsx';
//Dashboards
import DashboardVendas from './componentes/pages/DashBoards/DashBVendas.jsx';
//Catalogo
import CatalogoProdutos from './componentes/pages/catalogo/CatalgoProdutos.jsx';
import CatalogoFornecedores from './componentes/pages/catalogo/CatalogoFornecedores.jsx';
//Relatórios
import RelatorioGastos from './componentes/pages/relatorios/Gastos/Gastos.jsx';
import RelatorioVendas from './componentes/pages/relatorios/Vendas/RelatorioVendas.jsx';


function App() { 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'  element ={<Login/>}></Route>
          <Route path='/home'  element ={<Home/>}></Route>

          <Route path='/cadastro-Fornecedor'  element ={<CadastroFornecedor/>}></Route>
          <Route path='/cadastro-Vendas'  element ={<CadastroVendas/>}></Route>
          <Route path='/cadastro-Produto'  element ={<CadastroProduto/>}></Route>
          <Route path='/cadastro-Categoria'  element ={<CadastroCategoria/>}></Route>
          <Route path='/cadastro-Compra'  element ={<CadastroCompra/>}></Route>
          <Route path='/cadastro-Cliente'  element ={<CadastroCliente/>}></Route>


          <Route path='/dashboard-Vendas'  element ={<DashboardVendas/>}></Route>


          <Route path='/catalogo-Produtos'  element ={<CatalogoProdutos/>}></Route>
          <Route path='/catalogo-Fornecedores'  element ={<CatalogoFornecedores/>}></Route>

          <Route path='/relatorio-Gastos'  element ={<RelatorioGastos/>}></Route>
          <Route path='/relatorio-Vendas'  element ={<RelatorioVendas/>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
