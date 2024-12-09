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
    media: '',
  });
  const [categoriasData, setCategoriasData] = useState({ labels: [], values: [] });

  const BASE_URL = 'http://localhost:3001';

  const handleFiltro = async () => {
    console.log(`Data Início: ${dataInicio}, Data Fim: ${dataFim}`);
  
    try {
      //dia mais vendido
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Recupera o token do localStorage
      };
      const responseDiaMais = await fetch(
        `${BASE_URL}/produto/diamais?dataInicio=${dataInicio}&dataFim=${dataFim}`,
        {headers}
      );
      const textDiaMais = await responseDiaMais.text(); // Obter a resposta como texto
      console.log('Resposta do diaMais:', textDiaMais);  // Log da resposta
  
      const diaMais = JSON.parse(textDiaMais);  // Tentar analisar o texto como JSON
      //dia menos vendido
      const responseDiaMenos = await fetch(
        `${BASE_URL}/produto/diamenos?dataInicio=${dataInicio}&dataFim=${dataFim}`,
        {headers}
      );
      const textDiaMenos = await responseDiaMenos.text();
      console.log('Resposta do diaMenos:', textDiaMenos);
  
      const diaMenos = JSON.parse(textDiaMenos);
      //total de vendas
      const responseTotal = await fetch(
        `${BASE_URL}/produto/total?dataInicio=${dataInicio}&dataFim=${dataFim}`,
        {headers}
      );
      const textTotal = await responseTotal.text();
      console.log('Resposta total:', textTotal);
      
      const total = JSON.parse(textTotal);
      //média de vendas
      const responseMedia = await fetch(
        `${BASE_URL}/produto/media?dataInicio=${dataInicio}&dataFim=${dataFim}`,
        {headers}
      );
      const textMedia = await responseMedia.text();
      console.log('Resposta total:', textMedia);
      
      const media = JSON.parse(textMedia);

      

      const responseCategorias = await fetch(
        `${BASE_URL}/produto/countcategoria?dataInicio=${dataInicio}&dataFim=${dataFim}`,
        {headers}
      );
      const textCategorias = await responseCategorias.text();
      console.log('Resposta categorias:', textCategorias);
  
      const categorias = JSON.parse(textCategorias);
  
      if (responseDiaMais.ok && responseDiaMenos.ok) {
        setIndicadores({
          diaMaisVendeu: diaMais.dia,
          diaMenosVendeu: diaMenos.dia,
          botijoesVendidos: total.totalvendido,
          media: media.mediavendido,
        });
        setCategoriasData({
          labels: categorias.map((cat) => cat.nome),
          values: categorias.map((cat) => cat.quantidade),
        });
      } else {
        console.error('Erro ao buscar dados:', { diaMais, diaMenos, categorias });
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
        <h1>Dashboard Vendas</h1>
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
                  <Typography variant="h4">
                    {indicadores.diaMaisVendeu
                      ? new Date(indicadores.diaMaisVendeu).toLocaleDateString('pt-BR')
                      : '-'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dia que Menos Vendeu
                  </Typography>
                  <Typography variant="h4">
                    {indicadores.diaMenosVendeu
                      ? new Date(indicadores.diaMenosVendeu).toLocaleDateString('pt-BR')
                      : '-'}
                  </Typography>
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
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Média de botijões vendidos
                  </Typography>
                  <Typography variant="h4">{indicadores.media}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
  {/* Gráfico de Barras */}
  <Grid item xs={12} md={6}>
    <Box sx={{ height: '300px' }}>
      
    </Box>
  </Grid>

  {/* Gráfico de Pizza */}
  <Grid item xs={12} md={6}>
    <Box sx={{ height: '300px' }}>
      
    </Box>
  </Grid>

  {/* Gráfico de Linhas */}
  <Grid item xs={12} md={12}>
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
