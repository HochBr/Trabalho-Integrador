// DonutChart.js
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const DonutChart = () => {
  useEffect(() => {
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

    return () => {
      donutChart.destroy();
    };
  }, []);

  return <div id="donutChart" style={{ width: '100%' }}></div>;
};

export default DonutChart;
