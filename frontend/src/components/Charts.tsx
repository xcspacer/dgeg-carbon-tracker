/**
 * Componentes de Gráficos
 * 
 * Visualização dos indicadores usando Chart.js
 * Bónus do Tech2C Challenge
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { IndicatorsResponse } from '../types';
import './Charts.css';

// Registar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  data: IndicatorsResponse;
}

// Paleta de cores consistente
const colors = {
  primary: 'rgba(16, 185, 129, 1)',      // primary-500
  primaryLight: 'rgba(16, 185, 129, 0.5)',
  secondary: 'rgba(245, 158, 11, 1)',    // amber-500
  secondaryLight: 'rgba(245, 158, 11, 0.5)',
  tertiary: 'rgba(59, 130, 246, 1)',     // blue-500
  tertiaryLight: 'rgba(59, 130, 246, 0.5)',
  quaternary: 'rgba(139, 92, 246, 1)',   // purple-500
  quaternaryLight: 'rgba(139, 92, 246, 0.5)',
  gray: 'rgba(107, 114, 128, 1)',        // gray-500
  grayLight: 'rgba(107, 114, 128, 0.5)',
};

const sectorColors = [
  'rgba(16, 185, 129, 0.8)',   // verde
  'rgba(245, 158, 11, 0.8)',   // amarelo
  'rgba(59, 130, 246, 0.8)',   // azul
  'rgba(139, 92, 246, 0.8)',   // roxo
  'rgba(236, 72, 153, 0.8)',   // rosa
];

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  // ========================================================================
  // Gráfico 1: Emissões por Ano (Bar Chart)
  // ========================================================================
  const yearlyEmissionsData = {
    labels: data.total_co2_por_ano.map(y => y.ano.toString()),
    datasets: [
      {
        label: 'Emissões CO₂ (ton)',
        data: data.total_co2_por_ano.map(y => y.total_emissoes),
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Consumo Energia (MWh)',
        data: data.total_co2_por_ano.map(y => y.total_consumo),
        backgroundColor: colors.secondaryLight,
        borderColor: colors.secondary,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const yearlyEmissionsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emissões e Consumo por Ano',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // ========================================================================
  // Gráfico 2: Top 5 Empresas (Horizontal Bar)
  // ========================================================================
  const topCompaniesData = {
    labels: data.top_5_maiores_emissores.map(c => c.empresa),
    datasets: [
      {
        label: 'Emissões CO₂ (ton)',
        data: data.top_5_maiores_emissores.map(c => c.total_emissoes),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.65)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(16, 185, 129, 0.35)',
          'rgba(16, 185, 129, 0.2)',
        ],
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const topCompaniesOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 5 Empresas - Maiores Emissões CO₂',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  // ========================================================================
  // Gráfico 3: Distribuição por Setor (Doughnut)
  // ========================================================================
  const sectorDistributionData = {
    labels: data.dados_por_setor.map(s => s.setor),
    datasets: [
      {
        data: data.dados_por_setor.map(s => s.total_emissoes),
        backgroundColor: sectorColors.slice(0, data.dados_por_setor.length),
        borderColor: 'white',
        borderWidth: 3,
      },
    ],
  };

  const sectorDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribuição de Emissões por Setor',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  // ========================================================================
  // Gráfico 4: Tendência Temporal (Line Chart)
  // ========================================================================
  const trendData = {
    labels: data.total_co2_por_ano.map(y => y.ano.toString()),
    datasets: [
      {
        label: 'Emissões CO₂ (ton)',
        data: data.total_co2_por_ano.map(y => y.total_emissoes),
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tendência de Emissões ao Longo do Tempo',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="charts-section">
      <h2 className="charts-title">Visualização de Dados</h2>
      
      <div className="charts-grid">
        {/* Gráfico de Barras - Emissões por Ano */}
        <div className="chart-container large">
          <Bar data={yearlyEmissionsData} options={yearlyEmissionsOptions} />
        </div>

        {/* Gráfico Doughnut - Setores */}
        <div className="chart-container">
          <Doughnut data={sectorDistributionData} options={sectorDistributionOptions} />
        </div>

        {/* Gráfico de Barras Horizontal - Top Empresas */}
        <div className="chart-container">
          <Bar data={topCompaniesData} options={topCompaniesOptions} />
        </div>

        {/* Gráfico de Linha - Tendência */}
        <div className="chart-container large">
          <Line data={trendData} options={trendOptions} />
        </div>
      </div>
    </div>
  );
};
