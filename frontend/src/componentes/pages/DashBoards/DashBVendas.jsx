import React, { useState } from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../TelaGeral/Navbar.jsx';
import { Grid, TextField, Button, Card, CardContent } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';



// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const [categoriasData, setCategoriasData] = useState({ labels: [], values: [] });
  const [areaChartData, setAreaChartData] = useState({ labels: [], values: [] });

  const BASE_URL = 'http://localhost:3001';

  const handleFiltro = async () => {
    console.log(`Data Início: ${dataInicio}, Data Fim: ${dataFim}`);
  
    try {
      const responseDiaMais = await fetch(
        `${BASE_URL}/produto/diamais?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const textDiaMais = await responseDiaMais.text(); // Obter a resposta como texto
      console.log('Resposta do diaMais:', textDiaMais);  // Log da resposta
  
      const diaMais = JSON.parse(textDiaMais);  // Tentar analisar o texto como JSON
  
      const responseDiaMenos = await fetch(
        `${BASE_URL}/produto/diamenos?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const textDiaMenos = await responseDiaMenos.text();
      console.log('Resposta do diaMenos:', textDiaMenos);
  
      const diaMenos = JSON.parse(textDiaMenos);
  
      const responseTotal = await fetch(
        `${BASE_URL}/produto/total?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const textTotal = await responseTotal.text();
      console.log('Resposta total:', textTotal);
  
      const total = JSON.parse(textTotal);
  
      const responseCategorias = await fetch(
        `${BASE_URL}/produto/countcategoria?dataInicio=${dataInicio}&dataFim=${dataFim}`
      );
      const textCategorias = await responseCategorias.text();
      console.log('Resposta categorias:', textCategorias);
  
      const categorias = JSON.parse(textCategorias);
  
      if (responseDiaMais.ok && responseDiaMenos.ok) {
        setIndicadores({
          diaMaisVendeu: diaMais.dia,
          diaMenosVendeu: diaMenos.dia,
          botijoesVendidos: total.totalvendido,
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
  
  

  const barChartData = {
    labels: categoriasData.labels,
    datasets: [
      {
        label: 'Quantidade de Produtos Vendidos',
        data: categoriasData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Produtos Vendidos por Categoria' },
    },
  };

  const lineChartData = {
    labels: categoriasData.labels,
    datasets: [
      {
        label: 'Vendas por Categoria',
        data: categoriasData.values,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };
  
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tendência de Vendas por Categoria' },
    },
  };
  
  const pieChartData = {
    labels: categoriasData.labels,
    datasets: [
      {
        label: 'Proporção de Produtos Vendidos',
        data: categoriasData.values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Proporção de Produtos Vendidos' },
    },
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
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
  {/* Gráfico de Barras */}
  <Grid item xs={12} md={6}>
    <Box sx={{ height: '300px' }}>
      <Bar data={barChartData} options={barChartOptions} />
    </Box>
  </Grid>

  {/* Gráfico de Pizza */}
  <Grid item xs={12} md={6}>
    <Box sx={{ height: '300px' }}>
      <Pie data={pieChartData} options={pieChartOptions} />
    </Box>
  </Grid>

  {/* Gráfico de Linhas */}
  <Grid item xs={12} md={12}>
    <Box sx={{ height: '300px' }}>
      <Line data={lineChartData} options={lineChartOptions} />
    </Box>
  </Grid>
</Grid>

        </Box>
      </Box>
    </div>
  );
};

export default DashboardCompras;
