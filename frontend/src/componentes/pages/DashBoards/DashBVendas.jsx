import React, { useState } from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../TelaGeral/Navbar.jsx';
import { Grid, TextField, Button, Card, CardContent } from '@mui/material';

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
  const [indicadores, setIndicadores] = useState({
    diaMaisVendeu: '',
    diaMenosVendeu: '',
    botijoesVendidos: '',
  });

  const BASE_URL = 'http://localhost:3001'; // Substitua pelo endereço correto em produção

  const handleFiltro = async () => {
    console.log(`Data Início: ${dataInicio}, Data Fim: ${dataFim}`);
  
    try {
      const responseDiaMais = await fetch(
        `${BASE_URL}/produto/diamais?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const diaMais = await responseDiaMais.json();
  
      const responseDiaMenos = await fetch(
        `${BASE_URL}/produto/diamenos?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const diaMenos = await responseDiaMenos.json();
  
      if (responseDiaMais.ok && responseDiaMenos.ok) {
        setIndicadores({
          diaMaisVendeu: diaMais.dia,
          diaMenosVendeu: diaMenos.dia,
          botijoesVendidos: parseInt(diaMais.totalvendido + diaMenos.totalvendido),
        });
      } else {
        console.error('Erro ao buscar dados:', { diaMais, diaMenos });
      }
    } catch (error) {
      console.error('Erro na conexão com as APIs:', error);
    }
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

          {/* Indicadores */}
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dia que Mais Vendeu
                  </Typography>
                  <Typography variant="h4">{indicadores.diaMaisVendeu}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dia que Menos Vendeu
                  </Typography>
                  <Typography variant="h4">{indicadores.diaMenosVendeu}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Botijões Vendidos no Período
                  </Typography>
                  <Typography variant="h4">{indicadores.botijoesVendidos}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '300px' }}>
                
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '300px' }}>
                
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '300px' }}>
               
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardCompras;