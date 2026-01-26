# Documento Explicativo - Abordagem Técnica

## Tech2C Junior/Mid Fullstack Engineer Challenge 2025

Este documento descreve a abordagem técnica utilizada no desenvolvimento da solução DGEG Carbon Tracker.

---

## 1. Abordagem para Extração e Processamento de Dados

### 1.1 Leitura do Ficheiro Excel

Para a extração de dados do ficheiro Excel, utilizei a biblioteca **Pandas** em conjunto com **OpenPyXL**. Esta combinação foi escolhida por:

- **Robustez**: Pandas é o standard da indústria para manipulação de dados tabulares em Python
- **Flexibilidade**: Suporta múltiplos formatos (.xlsx, .xls)
- **Performance**: Otimizado para operações em grandes volumes de dados
- **Facilidade de uso**: API intuitiva para agregações e transformações

### 1.2 Validação de Dados

Implementei validação em múltiplas camadas:

```python
def validate_excel_structure(df: pd.DataFrame) -> bool:
    required_columns = [
        'Empresa', 'Ano', 'Setor', 
        'Consumo de Energia (MWh)', 
        'Emissões de CO2 (toneladas)'
    ]
    # Verifica se todas as colunas necessárias existem
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise HTTPException(status_code=400, detail=f"Colunas em falta: {missing_columns}")
```

Esta abordagem garante:
- Feedback claro ao utilizador sobre erros no ficheiro
- Proteção contra dados mal formatados
- Mensagens de erro específicas e úteis

### 1.3 Cálculo de Indicadores

Os indicadores foram implementados usando operações vetorizadas do Pandas, maximizando a eficiência:

#### Indicador 1: Total CO₂ por Ano
```python
yearly_data = df_work.groupby('ano').agg({
    'emissoes': 'sum',
    'consumo': 'sum',
    'empresa': 'nunique'
})
```

#### Indicador 2: Média de Consumo por Empresa
```python
consumo_por_empresa = df_work.groupby('empresa')['consumo'].mean()
media_consumo = consumo_por_empresa.mean()
```

#### Indicador 3: Top 5 Maiores Emissores
```python
empresa_totals = df_work.groupby('empresa').agg({
    'emissoes': 'sum',
    'consumo': 'sum'
})
top_5 = empresa_totals.nlargest(5, 'emissoes')
```

### 1.4 Indicadores Adicionais

Para agregar valor, implementei indicadores extra:
- **Análise por Setor**: Totais e médias por setor de atividade
- **Totais Gerais**: Visão consolidada das emissões e consumo
- **Metadados**: Número de empresas, anos e setores disponíveis

---

## 2. Stack Tecnológico

### 2.1 Backend: Python + FastAPI

**Porquê Python?**
- Ecossistema robusto para análise de dados (Pandas, NumPy)
- Simplicidade e legibilidade do código
- Amplamente usado na indústria para processamento de dados

**Porquê FastAPI?**
- **Performance**: Um dos frameworks Python mais rápidos
- **Tipagem**: Validação automática com Pydantic
- **Documentação**: OpenAPI/Swagger gerado automaticamente
- **Assíncrono**: Suporte nativo a async/await
- **Moderno**: Segue as melhores práticas atuais

### 2.2 Frontend: React + TypeScript

**Porquê React?**
- Biblioteca mais popular para desenvolvimento de UI
- Componentização facilita manutenção e reutilização
- Ecossistema rico de bibliotecas
- Vasta documentação e comunidade

**Porquê TypeScript?**
- **Segurança de tipos**: Deteta erros em tempo de desenvolvimento
- **Melhor DX**: Autocompletar e refactoring mais seguros
- **Documentação implícita**: Tipos servem como documentação
- **Escalabilidade**: Facilita manutenção em projetos maiores

### 2.3 Bibliotecas Adicionais

| Biblioteca | Propósito | Justificação |
|------------|-----------|--------------|
| **Chart.js** | Gráficos | Leve, responsivo, fácil de customizar |
| **Axios** | HTTP Client | API mais limpa que fetch, interceptors |
| **Lucide** | Ícones | Ícones modernos, tree-shakeable |
| **Vite** | Build Tool | Muito mais rápido que CRA, HMR instantâneo |

### 2.4 Docker

Escolhi Docker para:
- **Reprodutibilidade**: Ambiente consistente em qualquer máquina
- **Facilidade de deploy**: Um comando para iniciar tudo
- **Isolamento**: Dependências não conflitam com o sistema
- **Produção-ready**: Mesma configuração de dev e prod

---

## 3. Arquitetura da Solução

### 3.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ FileUpload  │  │IndicatorCards│  │      Charts         │ │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘ │
│         │                │                      │            │
│         └────────────────┼──────────────────────┘            │
│                          ▼                                   │
│                    ┌──────────┐                              │
│                    │   App    │                              │
│                    └────┬─────┘                              │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP (Axios)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    FastAPI                            │   │
│  │  ┌─────────────┐  ┌────────────┐  ┌───────────────┐  │   │
│  │  │  Endpoints  │  │ Validation │  │  Processing   │  │   │
│  │  │  /api/*     │  │  Pydantic  │  │   Pandas      │  │   │
│  │  └─────────────┘  └────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Dados

1. **Upload**: Utilizador faz upload do ficheiro Excel
2. **Validação**: Backend valida estrutura e tipo do ficheiro
3. **Processamento**: Pandas extrai e calcula indicadores
4. **Resposta**: API retorna JSON estruturado com Pydantic
5. **Visualização**: Frontend renderiza cards e gráficos

### 3.3 Tratamento de Erros

Implementei tratamento de erros em múltiplos níveis:

**Backend:**
- Validação de tipo de ficheiro (extensão)
- Validação de estrutura (colunas obrigatórias)
- Captura de exceções genéricas

**Frontend:**
- Feedback visual durante loading
- Mensagens de erro claras ao utilizador
- Estado de erro limpo ao iniciar nova ação

---

## 4. Decisões de Design

### 4.1 Interface do Utilizador

- **Clean Design**: Interface minimalista focada nos dados
- **Feedback Visual**: Loading states e mensagens claras
- **Responsividade**: Funciona em desktop e mobile
- **Cores**: Paleta verde remetendo a sustentabilidade/ambiente

### 4.2 Boas Práticas Implementadas

**Código:**
- Tipagem forte (TypeScript + Pydantic)
- Componentes reutilizáveis
- Separação de responsabilidades
- Documentação no código

**Arquitetura:**
- API RESTful
- Containerização com Docker
- Configuração via variáveis de ambiente
- Health checks para monitorização

---

## 5. Funcionalidades Bónus Implementadas

✅ **Gráficos Interativos**: 4 tipos diferentes de visualização
- Gráfico de barras (emissões por ano)
- Gráfico doughnut (distribuição por setor)
- Gráfico horizontal (top empresas)
- Gráfico de linha (tendência temporal)

✅ **Tratamento de Erros**: Validação completa com mensagens claras

✅ **Docker**: Aplicação totalmente dockerizada com docker-compose

---

## 6. Melhorias Futuras

Se houvesse mais tempo, implementaria:

1. **Testes automatizados** (pytest, Jest)
2. **CI/CD** com GitHub Actions
3. **Filtros interativos** por ano/setor
4. **Export de relatórios** em PDF
5. **Autenticação** para múltiplos utilizadores
6. **Base de dados** para histórico de uploads
7. **Comparação temporal** entre anos

---

## Conclusão

Esta solução demonstra competências em:
- Desenvolvimento fullstack (Python + React)
- Processamento de dados com Pandas
- Design de APIs RESTful
- Containerização com Docker
- UI/UX moderna e funcional
- Documentação técnica

O código está estruturado para ser mantido e escalado, seguindo as melhores práticas da indústria.

---

*Documento elaborado como parte do Tech2C Fullstack Challenge 2025*
