/**
 * DGEG Carbon Tracker - Aplicação Principal
 * 
 * Tech2C Junior/Mid Fullstack Engineer Challenge
 * 
 * Esta aplicação permite:
 * - Upload de ficheiros Excel da DGEG
 * - Visualização de indicadores de emissões de CO₂
 * - Gráficos interativos para análise de dados
 */

import React, { useState, useCallback } from 'react';
import { Leaf, FileSpreadsheet, BarChart2, Github, Info } from 'lucide-react';
import { FileUpload, IndicatorCards, Charts } from './components';
import { uploadExcelFile, getSampleData } from './services/api';
import { IndicatorsResponse } from './types';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState<IndicatorsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handler para upload de ficheiro
   */
  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadExcelFile(file);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handler para carregar dados de exemplo
   */
  const handleLoadSampleData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSampleData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handler para limpar dados
   */
  const handleClearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">
              <Leaf size={28} />
            </div>
            <div className="logo-text">
              <h1>DGEG Carbon Tracker</h1>
              <span className="logo-subtitle">Monitorização de Emissões de CO₂</span>
            </div>
          </div>
          <nav className="nav">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Hero Section - Mostrar quando não há dados */}
          {!data && (
            <section className="hero-section">
              <div className="hero-content">
                <h2 className="hero-title">
                  Analise as emissões de carbono da sua organização
                </h2>
                <p className="hero-description">
                  Faça upload do ficheiro Excel exportado pela DGEG para visualizar 
                  indicadores de emissões de CO₂ e consumo energético.
                </p>

                {/* File Upload */}
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isLoading={isLoading}
                  error={error}
                />

                {/* Demo Button */}
                <div className="demo-section">
                  <span className="demo-divider">ou</span>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleLoadSampleData}
                    disabled={isLoading}
                  >
                    <FileSpreadsheet size={20} />
                    Carregar Dados de Exemplo
                  </button>
                </div>

                {/* Info Box */}
                <div className="info-box">
                  <Info size={20} />
                  <div>
                    <strong>Formato esperado do Excel:</strong>
                    <ul>
                      <li>Empresa - Nome da empresa</li>
                      <li>Ano - Ano do registo</li>
                      <li>Setor - Setor de atividade</li>
                      <li>Consumo de Energia (MWh)</li>
                      <li>Emissões de CO2 (toneladas)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Results Section - Mostrar quando há dados */}
          {data && (
            <section className="results-section">
              {/* Actions Bar */}
              <div className="actions-bar">
                <div className="results-header">
                  <BarChart2 size={24} />
                  <h2>Resultados da Análise</h2>
                </div>
                <div className="actions">
                  <button 
                    className="btn btn-outline"
                    onClick={handleClearData}
                  >
                    Nova Análise
                  </button>
                </div>
              </div>

              {/* Indicator Cards */}
              <IndicatorCards data={data} />

              {/* Charts */}
              <Charts data={data} />

              {/* Data Table */}
              <div className="data-table-section">
                <h3 className="section-title">
                  <FileSpreadsheet size={24} />
                  Dados Completos
                </h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Ano</th>
                        <th>Setor</th>
                        <th>Consumo (MWh)</th>
                        <th>Emissões CO₂ (ton)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dados_completos.map((row, index) => (
                        <tr key={index}>
                          <td>{row.empresa}</td>
                          <td>{row.ano}</td>
                          <td>
                            <span className="sector-badge">{row.setor}</span>
                          </td>
                          <td className="number">
                            {new Intl.NumberFormat('pt-PT', { 
                              maximumFractionDigits: 2 
                            }).format(row.consumo)}
                          </td>
                          <td className="number">
                            {new Intl.NumberFormat('pt-PT', { 
                              maximumFractionDigits: 2 
                            }).format(row.emissoes)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>
            DGEG Carbon Tracker - Tech2C Fullstack Challenge 2025
          </p>
          <p className="footer-tech">
            Desenvolvido com React, TypeScript, FastAPI e Python
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
