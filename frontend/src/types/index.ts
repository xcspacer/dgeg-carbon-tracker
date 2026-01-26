/**
 * Tipos TypeScript para a aplicação DGEG Carbon Tracker
 */

export interface CompanyEmission {
  empresa: string;
  total_emissoes: number;
  total_consumo: number;
}

export interface YearlyEmission {
  ano: number;
  total_emissoes: number;
  total_consumo: number;
  num_empresas: number;
}

export interface SectorData {
  setor: string;
  total_emissoes: number;
  total_consumo: number;
  media_emissoes: number;
  media_consumo: number;
  num_registos: number;
}

export interface DataRecord {
  empresa: string;
  ano: number;
  setor: string;
  consumo: number;
  emissoes: number;
}

export interface IndicatorsResponse {
  total_co2_por_ano: YearlyEmission[];
  media_consumo_por_empresa: number;
  top_5_maiores_emissores: CompanyEmission[];
  dados_por_setor: SectorData[];
  total_geral_emissoes: number;
  total_geral_consumo: number;
  num_empresas_unicas: number;
  anos_disponiveis: number[];
  setores_disponiveis: string[];
  dados_completos: DataRecord[];
}

export interface ApiError {
  detail: string;
}
