/**
 * Serviço de API para comunicação com o backend
 */

import axios, { AxiosError } from 'axios';
import { IndicatorsResponse, ApiError } from '../types';

// URL base da API - em desenvolvimento usa proxy do Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Faz upload de um ficheiro Excel e retorna os indicadores calculados
 */
export async function uploadExcelFile(file: File): Promise<IndicatorsResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<IndicatorsResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Erro ao processar ficheiro. Tente novamente.');
  }
}

/**
 * Obtém dados de exemplo para demonstração
 */
export async function getSampleData(): Promise<IndicatorsResponse> {
  try {
    const response = await api.get<IndicatorsResponse>('/api/sample-data');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.detail) {
      throw new Error(axiosError.response.data.detail);
    }
    throw new Error('Erro ao obter dados de exemplo.');
  }
}

/**
 * Verifica se a API está disponível
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
}
