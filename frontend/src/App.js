import React, { useRef } from 'react';
import Login from './componentes/pages/TelaGeral/Login.js';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './componentes/pages/Home.jsx';
import Settings from './componentes/pages/Settings.jsx';
//CRUDS principais
import CadastroFornecedor from './componentes/pages/Cadastros/CadastroFornecedor.jsx';
import CadastroVendas from './componentes/pages/Cadastros/CadastroVendas.jsx';
import CadastroProduto from './componentes/pages/Cadastros/CadastroProduto.jsx';
//Dashboards
import DashboardCompras from './componentes/pages/DashBoards/DashBCompras.jsx';
import DashboardVendas from './componentes/pages/DashBoards/DashBVendas.jsx';
//Estoque
import Estoque from './componentes/pages/Estoque/Estoque.jsx';
//Catalogo
import CatalogoProdutos from './componentes/pages/catalogo/CatalgoProdutos.jsx';
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

          <Route path='/dashboard-Compras'  element ={<DashboardCompras/>}></Route>
          <Route path='/dashboard-Vendas'  element ={<DashboardVendas/>}></Route>

          <Route path='/estoque'  element ={<Estoque/>}></Route>

          <Route path='/catalogo-Produtos'  element ={<CatalogoProdutos/>}></Route>

          <Route path='/relatorio-Gastos'  element ={<RelatorioGastos/>}></Route>
          <Route path='/relatorio-Vendas'  element ={<RelatorioVendas/>}></Route>

          <Route path='/settings'  element ={<Settings/>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
