"""
DGEG Carbon Tracker - Backend API
================================
API para processar ficheiros Excel da DGEG e calcular indicadores de emissões de carbono.

Desenvolvido para: Tech2C Junior/Mid Fullstack Engineer Challenge
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import io

# ============================================================================
# Pydantic Models - Estrutura de dados da API
# ============================================================================

class CompanyEmission(BaseModel):
    """Modelo para dados de emissão por empresa"""
    empresa: str
    total_emissoes: float
    total_consumo: float

class YearlyEmission(BaseModel):
    """Modelo para emissões anuais"""
    ano: int
    total_emissoes: float
    total_consumo: float
    num_empresas: int

class SectorData(BaseModel):
    """Modelo para dados por setor"""
    setor: str
    total_emissoes: float
    total_consumo: float
    media_emissoes: float
    media_consumo: float
    num_registos: int

class IndicatorsResponse(BaseModel):
    """Modelo principal de resposta com todos os indicadores"""
    # Indicadores principais (requeridos pelo challenge)
    total_co2_por_ano: List[YearlyEmission]
    media_consumo_por_empresa: float
    top_5_maiores_emissores: List[CompanyEmission]
    
    # Indicadores adicionais (valor agregado)
    dados_por_setor: List[SectorData]
    total_geral_emissoes: float
    total_geral_consumo: float
    num_empresas_unicas: int
    anos_disponiveis: List[int]
    setores_disponiveis: List[str]
    
    # Dados brutos para gráficos
    dados_completos: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    """Modelo para health check"""
    status: str
    message: str

# ============================================================================
# Aplicação FastAPI
# ============================================================================

app = FastAPI(
    title="DGEG Carbon Tracker API",
    description="API para processamento de dados de emissões de carbono da DGEG",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração CORS para permitir conexões do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Funções de Processamento de Dados
# ============================================================================

def validate_excel_structure(df: pd.DataFrame) -> bool:
    """
    Valida se o ficheiro Excel tem a estrutura esperada.
    
    Args:
        df: DataFrame pandas com os dados do Excel
        
    Returns:
        bool: True se a estrutura é válida
        
    Raises:
        HTTPException: Se a estrutura for inválida
    """
    required_columns = [
        'Empresa', 
        'Ano', 
        'Setor', 
        'Consumo de Energia (MWh)', 
        'Emissões de CO2 (toneladas)'
    ]
    
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Ficheiro Excel inválido. Colunas em falta: {', '.join(missing_columns)}"
        )
    
    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="Ficheiro Excel está vazio."
        )
    
    return True

def calculate_indicators(df: pd.DataFrame) -> IndicatorsResponse:
    """
    Calcula todos os indicadores a partir dos dados do Excel.
    
    Args:
        df: DataFrame pandas com os dados validados
        
    Returns:
        IndicatorsResponse: Objeto com todos os indicadores calculados
    """
    
    # Renomear colunas para facilitar processamento
    df_work = df.rename(columns={
        'Empresa': 'empresa',
        'Ano': 'ano',
        'Setor': 'setor',
        'Consumo de Energia (MWh)': 'consumo',
        'Emissões de CO2 (toneladas)': 'emissoes'
    })
    
    # ========================================================================
    # INDICADOR 1: Total CO₂ emissions per year
    # ========================================================================
    yearly_data = df_work.groupby('ano').agg({
        'emissoes': 'sum',
        'consumo': 'sum',
        'empresa': 'nunique'
    }).reset_index()
    
    total_co2_por_ano = [
        YearlyEmission(
            ano=int(row['ano']),
            total_emissoes=round(row['emissoes'], 2),
            total_consumo=round(row['consumo'], 2),
            num_empresas=int(row['empresa'])
        )
        for _, row in yearly_data.iterrows()
    ]
    
    # ========================================================================
    # INDICADOR 2: Average energy consumption per company
    # ========================================================================
    consumo_por_empresa = df_work.groupby('empresa')['consumo'].mean()
    media_consumo_por_empresa = round(consumo_por_empresa.mean(), 2)
    
    # ========================================================================
    # INDICADOR 3: Top 5 companies with highest emissions
    # ========================================================================
    empresa_totals = df_work.groupby('empresa').agg({
        'emissoes': 'sum',
        'consumo': 'sum'
    }).reset_index()
    
    top_5 = empresa_totals.nlargest(5, 'emissoes')
    
    top_5_maiores_emissores = [
        CompanyEmission(
            empresa=row['empresa'],
            total_emissoes=round(row['emissoes'], 2),
            total_consumo=round(row['consumo'], 2)
        )
        for _, row in top_5.iterrows()
    ]
    
    # ========================================================================
    # INDICADORES ADICIONAIS (valor agregado)
    # ========================================================================
    
    # Dados por setor
    sector_data = df_work.groupby('setor').agg({
        'emissoes': ['sum', 'mean', 'count'],
        'consumo': ['sum', 'mean']
    }).reset_index()
    
    sector_data.columns = ['setor', 'total_emissoes', 'media_emissoes', 
                           'num_registos', 'total_consumo', 'media_consumo']
    
    dados_por_setor = [
        SectorData(
            setor=row['setor'],
            total_emissoes=round(row['total_emissoes'], 2),
            total_consumo=round(row['total_consumo'], 2),
            media_emissoes=round(row['media_emissoes'], 2),
            media_consumo=round(row['media_consumo'], 2),
            num_registos=int(row['num_registos'])
        )
        for _, row in sector_data.iterrows()
    ]
    
    # Totais gerais
    total_geral_emissoes = round(df_work['emissoes'].sum(), 2)
    total_geral_consumo = round(df_work['consumo'].sum(), 2)
    
    # Metadados
    num_empresas_unicas = df_work['empresa'].nunique()
    anos_disponiveis = sorted(df_work['ano'].unique().tolist())
    setores_disponiveis = sorted(df_work['setor'].unique().tolist())
    
    # Dados completos para gráficos
    dados_completos = df_work.to_dict('records')
    
    return IndicatorsResponse(
        total_co2_por_ano=total_co2_por_ano,
        media_consumo_por_empresa=media_consumo_por_empresa,
        top_5_maiores_emissores=top_5_maiores_emissores,
        dados_por_setor=dados_por_setor,
        total_geral_emissoes=total_geral_emissoes,
        total_geral_consumo=total_geral_consumo,
        num_empresas_unicas=num_empresas_unicas,
        anos_disponiveis=anos_disponiveis,
        setores_disponiveis=setores_disponiveis,
        dados_completos=dados_completos
    )

# ============================================================================
# Endpoints da API
# ============================================================================

@app.get("/", response_model=HealthResponse)
async def root():
    """
    Endpoint raiz - Health check da API.
    """
    return HealthResponse(
        status="healthy",
        message="DGEG Carbon Tracker API está operacional"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint para monitorização.
    """
    return HealthResponse(
        status="healthy",
        message="API funcionando corretamente"
    )

@app.post("/api/upload", response_model=IndicatorsResponse)
async def upload_excel(file: UploadFile = File(...)):
    """
    Upload e processamento de ficheiro Excel da DGEG.
    
    Este endpoint:
    1. Recebe um ficheiro Excel (.xlsx ou .xls)
    2. Valida a estrutura do ficheiro
    3. Processa os dados e calcula indicadores
    4. Retorna os indicadores calculados
    
    **Indicadores calculados:**
    - Total de emissões CO₂ por ano
    - Média de consumo de energia por empresa
    - Top 5 empresas com maiores emissões
    - Dados agregados por setor
    - Totais e médias gerais
    
    **Formato esperado do Excel:**
    - Empresa: nome da empresa
    - Ano: ano do registo
    - Setor: setor de atividade
    - Consumo de Energia (MWh): consumo energético
    - Emissões de CO2 (toneladas): emissões de CO2
    """
    
    # Validar tipo de ficheiro
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Nome do ficheiro não fornecido"
        )
    
    allowed_extensions = ['.xlsx', '.xls']
    file_extension = '.' + file.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de ficheiro não suportado. Use: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Ler conteúdo do ficheiro
        contents = await file.read()
        
        # Converter para DataFrame
        df = pd.read_excel(io.BytesIO(contents))
        
        # Validar estrutura
        validate_excel_structure(df)
        
        # Calcular indicadores
        indicators = calculate_indicators(df)
        
        return indicators
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar ficheiro: {str(e)}"
        )

@app.get("/api/sample-data", response_model=IndicatorsResponse)
async def get_sample_data():
    """
    Retorna dados de exemplo para demonstração.
    
    Útil para testar o frontend sem fazer upload de ficheiro.
    """
    # Dados de exemplo baseados na estrutura do DGEG
    sample_data = {
        'Empresa': ['Empresa A', 'Empresa A', 'Empresa B', 'Empresa B', 'Empresa C', 
                   'Empresa C', 'Empresa D', 'Empresa D', 'Empresa E', 'Empresa E'],
        'Ano': [2022, 2023, 2022, 2023, 2022, 2023, 2022, 2023, 2022, 2023],
        'Setor': ['Indústria', 'Indústria', 'Transporte', 'Transporte', 'Construção',
                 'Construção', 'Indústria', 'Indústria', 'Transporte', 'Transporte'],
        'Consumo de Energia (MWh)': [5000, 5200, 3500, 3600, 2000, 2100, 4500, 4700, 6000, 6200],
        'Emissões de CO2 (toneladas)': [2500, 2600, 1750, 1800, 1000, 1050, 2250, 2350, 3000, 3100]
    }
    
    df = pd.DataFrame(sample_data)
    return calculate_indicators(df)


# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
