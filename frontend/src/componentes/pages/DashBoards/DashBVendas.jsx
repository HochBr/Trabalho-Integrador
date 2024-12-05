import React, { useState } from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../TelaGeral/Navbar.jsx';
import LineChart from './Graficos/Grafico_Linha.jsx';
import DonutChart from './Graficos/Grafico_Donut.jsx';
import SemiChart from './Graficos/Grafico_Semi.jsx';
import { Grid, TextField, Button } from '@mui/material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DashboardCompras = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleFiltro = () => {
    console.log(`Data Início: ${dataInicio}, Data Fim: ${dataFim}`);
    // Aqui você pode aplicar os filtros nos gráficos ou chamar uma API.
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>Dashboard Compras</h1>
          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Data Início"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Data Fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFiltro}
                fullWidth
              >
                Aplicar Filtro
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '300px' }}>
                <LineChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '300px' }}>
                <DonutChart />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '300px' }}>
                <SemiChart />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardCompras;
