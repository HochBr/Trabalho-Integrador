import React, { useState } from 'react';
import Navbar from "../TelaGeral/Navbar";
import Sidernav from '../TelaGeral/Sidernav'
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CadastroCliente = () => {
  const location = useLocation();

  // Verifique se o estado está definido corretamente
  const state = location.state || {};
  const totalVenda = state.totalVenda || 0; // Valor padrão: 0

  const [formValues, setFormValues] = useState({
    Nome_Cliente: '',
    Saldo_Cliente: '',
    Contato_Cliente: '',
    Endereco_Cliente: '',
    Email_Fornecedor: '',
  });

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>Cadastro Cliente</h1>
          <Typography variant="h6">
            Valor Total da Compra: R$ {totalVenda.toFixed(2)}
          </Typography>
          <Typography variant="h6">
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default CadastroCliente;
