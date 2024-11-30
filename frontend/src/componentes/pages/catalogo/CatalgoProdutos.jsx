import React from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx'
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../TelaGeral/Navbar.jsx';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const CatalogoProdutos = () => {
  return (
    <div>
      <Navbar/>
      <Box sx={{ display: 'flex' }}>
      <Sidernav/>
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>CatalogoProdutos</h1>
        </Box>
      </Box>
      
    </div>
  )
}

export default CatalogoProdutos