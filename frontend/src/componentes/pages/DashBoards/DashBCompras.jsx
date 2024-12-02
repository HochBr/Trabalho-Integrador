import React, { useEffect } from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Navbar from '../TelaGeral/Navbar.jsx';
import ApexCharts from 'apexcharts';
import Grid from '@mui/material/Grid';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px', // Espaçamento entre os campos
}));

const DashboardCompras = () => {
  useEffect(() => {
    // Gráfico de linhas
    const lineOptions = {
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    };

    const lineChart = new ApexCharts(document.querySelector('#lineChart'), lineOptions);
    lineChart.render();

    // Gráfico de donut
    const donutOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
        },
      },
      grid: {
        padding: {
          bottom: -100,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const donutChart = new ApexCharts(document.querySelector('#donutChart'), donutOptions);
    donutChart.render();

    // Cleanup para destruir os gráficos
    return () => {
      lineChart.destroy();
      donutChart.destroy();
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <h1>Dashboard Compras</h1>
          <Grid container spacing={2}>
            {/* Gráfico de linhas */}
            <Grid item xs={12} md={6}>
              <div id="lineChart" style={{ width: '100%' }}></div>
            </Grid>
            {/* Gráfico de donut */}
            <Grid item xs={12} md={6}>
              <div id="donutChart" style={{ width: '100%' }}></div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardCompras;