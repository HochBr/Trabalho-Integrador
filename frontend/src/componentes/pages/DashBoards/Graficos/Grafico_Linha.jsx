// LineChart.js
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const LineChart = () => {
  useEffect(() => {
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

    return () => {
      lineChart.destroy();
    };
  }, []);

  return <div id="lineChart" style={{ width: '100%' }}></div>;
};

export default LineChart;
