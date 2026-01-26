# DGEG Carbon Tracker

[![Tech2C Challenge](https://img.shields.io/badge/Tech2C-Fullstack%20Challenge%202025-green.svg)](https://tech2c.pt)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)

Aplicação web para análise e visualização de dados de emissões de carbono a partir de ficheiros Excel exportados pela DGEG (Direção-Geral de Energia e Geologia).

## Funcionalidades

- **Upload de ficheiros Excel** (.xlsx, .xls) com validação
- **Cálculo de indicadores**:
  - Total de emissões CO₂ por ano
  - Média de consumo energético por empresa
  - Top 5 empresas com maiores emissões
  - Análise por setor de atividade
- **Visualização interativa** com gráficos (barras, linhas, doughnut)
- **Interface responsiva** e moderna
- **API RESTful** documentada com OpenAPI/Swagger
- **Dockerizado** para fácil deployment

## Tecnologias Utilizadas

### Backend
- **Python 3.11** - Linguagem de programação
- **FastAPI** - Framework web moderno e rápido
- **Pandas** - Processamento e análise de dados
- **OpenPyXL** - Leitura de ficheiros Excel
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Chart.js** - Biblioteca de gráficos
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web/proxy reverso

## Como Executar

### Opção 1: Docker (Recomendado)

A forma mais simples de executar a aplicação:

```bash
# Clonar o repositório
git clone https://github.com/xcspacer/dgeg-carbon-tracker.git
cd dgeg-carbon-tracker

# Construir e iniciar os containers
docker-compose up --build

# A aplicação estará disponível em:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - Documentação API: http://localhost:8000/docs
```

Para parar:
```bash
docker-compose down
```

### Opção 2: Execução Local

#### Pré-requisitos
- Python 3.11+
- Node.js 18+
- npm ou yarn

#### Backend

```bash
# Navegar para a pasta do backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
# Em outro terminal, navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Estrutura do Projeto

```
dgeg-carbon-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py          # API FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── FileUpload.tsx
│   │   │   ├── IndicatorCards.tsx
│   │   │   └── Charts.tsx
│   │   ├── services/        # Serviços de API
│   │   ├── types/           # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── README.md
└── APPROACH.md              # Documento explicativo
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Health check |
| GET | `/health` | Status da API |
| POST | `/api/upload` | Upload e processamento de Excel |
| GET | `/api/sample-data` | Dados de exemplo |

### Exemplo de Uso da API

```bash
# Upload de ficheiro Excel
curl -X POST "http://localhost:8000/api/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@Dados_DGEG.xlsx"

# Obter dados de exemplo
curl "http://localhost:8000/api/sample-data"
```

## Formato do Ficheiro Excel

O ficheiro Excel deve conter as seguintes colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| Empresa | Texto | Nome da empresa |
| Ano | Número | Ano do registo |
| Setor | Texto | Setor de atividade |
| Consumo de Energia (MWh) | Número | Consumo energético |
| Emissões de CO2 (toneladas) | Número | Emissões de CO₂ |

## Indicadores Calculados

1. **Total de Emissões CO₂ por Ano**: Soma das emissões agrupadas por ano
2. **Média de Consumo por Empresa**: Média do consumo energético de todas as empresas
3. **Top 5 Maiores Emissores**: Empresas com maior total de emissões
4. **Análise por Setor**: Totais e médias por setor de atividade
5. **Totais Gerais**: Emissões e consumo total

## Screenshots

### Página Inicial
Interface de upload com drag & drop para ficheiros Excel.

### Dashboard de Resultados
Visualização completa com cards de indicadores e gráficos interativos.

## Contribuição

1. Fork o repositório
2. Crie uma branch para a feature (`git checkout -b feature/nova-feature`)
3. Commit as mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para o Tech2C Fullstack Challenge 2025.

---

**Desenvolvido com por um candidato Tech2C**
