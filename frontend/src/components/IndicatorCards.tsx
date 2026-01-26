/**
 * Componentes de Cards para exibição de indicadores
 * 
 * Exibe os indicadores principais de forma visual e clara
 */

import React from 'react';
import { 
  TrendingUp, 
  Zap, 
  Building2, 
  Factory, 
  Leaf,
  BarChart3
} from 'lucide-react';
import { IndicatorsResponse } from '../types';
import './IndicatorCards.css';

interface IndicatorCardsProps {
  data: IndicatorsResponse;
}

export const IndicatorCards: React.FC<IndicatorCardsProps> = ({ data }) => {
  // Formatar números para exibição
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="indicators-section">
      {/* Cards de resumo principal */}
      <div className="summary-cards">
        <div className="card summary-card primary">
          <div className="card-icon">
            <Leaf size={32} />
          </div>
          <div className="card-content">
            <span className="card-value">{formatNumber(data.total_geral_emissoes)}</span>
            <span className="card-label">Emissões Totais de CO₂ (ton)</span>
          </div>
        </div>

        <div className="card summary-card secondary">
          <div className="card-icon">
            <Zap size={32} />
          </div>
          <div className="card-content">
            <span className="card-value">{formatNumber(data.total_geral_consumo)}</span>
            <span className="card-label">Consumo Total de Energia (MWh)</span>
          </div>
        </div>

        <div className="card summary-card tertiary">
          <div className="card-icon">
            <Building2 size={32} />
          </div>
          <div className="card-content">
            <span className="card-value">{data.num_empresas_unicas}</span>
            <span className="card-label">Empresas Analisadas</span>
          </div>
        </div>

        <div className="card summary-card quaternary">
          <div className="card-icon">
            <BarChart3 size={32} />
          </div>
          <div className="card-content">
            <span className="card-value">{formatNumber(data.media_consumo_por_empresa)}</span>
            <span className="card-label">Média Consumo por Empresa (MWh)</span>
          </div>
        </div>
      </div>

      {/* Indicador 1: Emissões por Ano */}
      <div className="indicator-section">
        <h3 className="section-title">
          <TrendingUp size={24} />
          Total de Emissões CO₂ por Ano
        </h3>
        <div className="yearly-cards">
          {data.total_co2_por_ano.map((year) => (
            <div key={year.ano} className="card yearly-card">
              <div className="year-badge">{year.ano}</div>
              <div className="yearly-stats">
                <div className="stat">
                  <span className="stat-value">{formatNumber(year.total_emissoes)}</span>
                  <span className="stat-label">ton CO₂</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatNumber(year.total_consumo)}</span>
                  <span className="stat-label">MWh</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{year.num_empresas}</span>
                  <span className="stat-label">empresas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador 3: Top 5 Empresas */}
      <div className="indicator-section">
        <h3 className="section-title">
          <Factory size={24} />
          Top 5 Empresas com Maiores Emissões
        </h3>
        <div className="top-companies">
          {data.top_5_maiores_emissores.map((company, index) => (
            <div key={company.empresa} className="card company-card">
              <div className="company-rank">#{index + 1}</div>
              <div className="company-info">
                <span className="company-name">{company.empresa}</span>
                <div className="company-stats">
                  <span className="company-emissions">
                    <Leaf size={16} />
                    {formatNumber(company.total_emissoes)} ton CO₂
                  </span>
                  <span className="company-consumption">
                    <Zap size={16} />
                    {formatNumber(company.total_consumo)} MWh
                  </span>
                </div>
              </div>
              <div className="company-bar">
                <div 
                  className="company-bar-fill"
                  style={{ 
                    width: `${(company.total_emissoes / data.top_5_maiores_emissores[0].total_emissoes) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dados por Setor */}
      <div className="indicator-section">
        <h3 className="section-title">
          <Building2 size={24} />
          Análise por Setor
        </h3>
        <div className="sector-cards">
          {data.dados_por_setor.map((sector) => (
            <div key={sector.setor} className="card sector-card">
              <h4 className="sector-name">{sector.setor}</h4>
              <div className="sector-grid">
                <div className="sector-stat">
                  <span className="sector-stat-value">{formatNumber(sector.total_emissoes)}</span>
                  <span className="sector-stat-label">ton CO₂ Total</span>
                </div>
                <div className="sector-stat">
                  <span className="sector-stat-value">{formatNumber(sector.total_consumo)}</span>
                  <span className="sector-stat-label">MWh Total</span>
                </div>
                <div className="sector-stat">
                  <span className="sector-stat-value">{formatNumber(sector.media_emissoes)}</span>
                  <span className="sector-stat-label">Média CO₂</span>
                </div>
                <div className="sector-stat">
                  <span className="sector-stat-value">{sector.num_registos}</span>
                  <span className="sector-stat-label">Registos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
