# Relatório de Exploração Técnica — UI Dashboard & Dossiê Executivo em PDF
**Módulo de Análise das Demonstrações Contábeis & Administrador Financeiro Inteligente (CFO Virtual & Hub de Tomada de Decisão Financeira)**

---

## 1. Observation (Observações Diretas)

### 1.1. Arquitetura de Layout, Design Tokens & CSS
* **Arquivo inspecionado**: packages/web/src/index.css (linhas 1 a 475).
* **Paleta Diamond Champion / Platinum Suite v4.3**:
  - Backgrounds: --bg-deep: #070B14, --bg-main: #0B101D, --bg-surface: #101728, --bg-surface-elevated: #162035, --bg-surface-card: #131C30, --bg-surface-hover: #1C2844.
  - Bordas: --border-subtle: rgba(255, 255, 255, 0.08), --border-medium: rgba(255, 255, 255, 0.14), --border-highlight: rgba(16, 185, 129, 0.4).
  - Tipografia: --font-sans: 'Plus Jakarta Sans', --font-mono: 'JetBrains Mono'.
  - Cores Semafóricas:
    * Verde/Seguro: --emerald-500: #10B981, --emerald-400: #34D399, --emerald-bg: rgba(16, 185, 129, 0.12).
    * Ciano/Info: --cyan-500: #06B6D4, --cyan-400: #22D3EE, --cyan-bg: rgba(6, 182, 212, 0.12).
    * Âmbar/Alerta: --amber-500: #F59E0B, --amber-400: #FBBF24, --amber-bg: rgba(245, 158, 11, 0.12).
    * Vermelho/Perigo: --rose-500: #EF4444, --rose-400: #F87171, --rose-bg: rgba(239, 68, 68, 0.12).
    * Roxo/Estratégico: --purple-500: #8B5CF6, --purple-400: #A78BFA, --purple-bg: rgba(139, 92, 246, 0.12).
  - Estrutura 3-Zonas: .app-topbar-global (60px fixos), .app-sidebar-left (280px retrátil), .app-center-workspace (Canvas com rolagem vertical independente), .app-right-deck (320px copiloto/ações).
  - Scrollbar customizada ultra-fluida: .sidebar-nav-scroll::-webkit-scrollbar-thumb { background: #10B981; border-radius: 4px; }.

### 1.2. Padrões de Ícones e Componentização Gráfica
* **Biblioteca de Ícones**: lucide-react v1.31.0 (ex: Activity, TrendingUp, ShieldCheck, Scale, DollarSign, PieChart, BarChart3, Layers, FileText, Printer, Download, Sparkles, Sliders, AlertTriangle, CheckCircle2, Building).
* **Renderização Gráfica e Charting**: O projeto utiliza renderização nativa pura baseada em SVG reativo, classes CSS utilitárias (metric-card, grid-cards-4, panel-card, data-table, adge badge-emerald), e HTML5 Canvas, eliminando dependências pesadas de runtime e garantindo execução determinística e compatibilidade total com SSR/Vite/Vitest.

### 1.3. Padrões de Relatórios e Geração de PDF Existentes
* **Exemplos inspecionados**:
  - packages/web/src/views/ExecutiveReportsView.tsx (linhas 1-246): Utiliza generateExecutiveDossier de @soberano/core, cards de governança, balanço patrimonial, DRE, ativo imobilizado (CPC 27), CIAP (LC 87/96), parecer sem ressalvas e acionamento de window.print().
  - packages/core/src/reports/executive-dossier.ts (linhas 1-72): Estrutura ExecutiveDossier com cabecalho, 
esumoFinanceiro, governancaESeguranca e conclusoesAuditoria.

### 1.4. Estado Global e Barramento de Eventos
* **Repositório Operacional (packages/web/src/state/office-store.ts)**:
  - Gestão de empresas multi-tenant (CompanyTenant), regimes tributários (SIMPLES_NACIONAL, LUCRO_PRESUMIDO, LUCRO_REAL), colaboradores e folha de pagamento.
* **Barramento de Eventos (packages/web/src/state/office-event-bus.ts)**:
  - Eventos suportados: 'MONOPHASIC_TAX_SEGREGATED', 'PAYROLL_CLOSED', 'SECTORIAL_OPERATION_POSTED', 'BANK_RECONCILIATION_SYNCED', 'ANNUAL_CLOSING_ARE_EXECUTED'.
  - Permite subscrição reativa para sincronizar instantaneamente a economia tributária e o fechamento de folha com os cálculos do CFO Prescritivo.

### 1.5. Suíte de Testes e Vitest
* **Comando executado**: 
pm run test (vitest v4.1.10).
* **Resultado**: Test Files: 207 passed (207) | Tests: 628 passed (628) | Status: 100% GREEN.

---

## 2. Logic Chain (Cadeia de Raciocínio & Blueprint de Arquitetura)

### 2.1. Estrutura do Novo Módulo no Sistema
1. **Identificador do Módulo**: inancial_statement_analysis_cfo.
2. **Registro de Navegação (packages/web/src/config/navigation-modules.ts)**:
   - Categoria: contabil (Contabilidade & IFRS), isCore: true.
   - Propriedades: { id: 'financial_statement_analysis_cfo', name: 'Análise das Demonstrações & CFO Virtual', label: 'Análise das Demonstrações & CFO Virtual', icon: '💎', file: 'FinancialStatementAnalysisCfoView', departmentId: 'contabil', isCore: true }.
3. **Ponto de Entrada Central da View**:
   - Criar packages/web/src/views/FinancialStatementAnalysisCfoView.tsx.
   - Integrar no switch de views de packages/web/src/App.tsx.

### 2.2. Arquitetura Modular de 5 Abas (Tabs)

`
FinancialStatementAnalysisCfoView
├── TopHeader (Seletor de Período/Competência, Badge Sincronização, Score Geral)
├── TabBar (5 Abas com Ícones e Badges)
├── Tab 1: Cockpit Executivo & Termômetro de Saúde Financeira
│   ├── Semáforos de Status (Liquidez, Rentabilidade, Endividamento, Ciclo de Caixa)
│   ├── Altman Z-Score Gauge (Arco SVG 180° com Zonas: Perigo <1.81, Alerta 1.81-2.99, Seguro >2.99)
│   ├── Grid de 8 KPIs Financeiros (Ativo, PL, Receita Líquida, EBITDA, Lucro Líquido, Margens, ROE)
│   └── Matriz de Diagnóstico Rápido de Solvência
├── Tab 2: Decomposição DuPont 5 Estágios & Índices Detalhados
│   ├── Decomposição DuPont em Árvore Interativa (SVG Flow):
│   │   [Tax Burden] x [Interest Burden] x [EBIT Margin] x [Asset Turnover] x [Equity Multiplier] = ROE
│   └── Tabelas de Índices Detalhados (Liquidez, Rentabilidade, Endividamento, PME/PMRV/PMPF, NCG, Efeito Tesoura)
├── Tab 3: CFO Prescritivo & Alocação Inteligente (IA Decisória & Governança)
│   ├── Painel de Sinergia Tripla (Contabilidade + Fiscal Monofásicos + DP Massa Salarial)
│   ├── Pareceres Prescritivos com IA (4 Quadrantes: Caixa, Custos, Fiscal, Estratégia de Dívida)
│   ├── Capacidade Máxima de Tomada de Crédito Saudável (Limite Seguro Dívida Líquida / EBITDA)
│   └── Alocação de Caixa Livre (FCF): Capex/Expansão vs Reserva Ciclo vs Dividendos Isentos
├── Tab 4: Simulador de Expansão & Investimentos What-If
│   ├── Sliders Interativos (CAPEX, Crescimento de Receita, Custos Fixos/Variáveis, WACC, Prazo)
│   ├── Métricas de Viabilidade (Break-Even Contábil/Financeiro/Econômico, Margem de Segurança, VPL, TIR, Payback)
│   └── Gráfico SVG de Fluxo de Caixa Acumulado e Curva de Payback
└── Tab 5: Emissão de Dossiê Executivo em PDF (Preview Interativo + Download)
    ├── Barra de Ações (Imprimir/Salvar PDF Oficial, Sincronizar com Ledger SHA-256)
    └── Preview A4 Paginado Diamond Champion (Capa, Balanço, DuPont, Pareceres CFO e Bloco de Assinatura)
`

### 2.3. Especificação Detalhada dos Componentes

#### 2.3.1. Tab 1: Cockpit Executivo & Termômetro de Saúde Financeira
* **Semáforos de Status (4 Cards de Topo)**:
  - *Liquidez*: Verde se Liquidez Corrente >= 1.50, Amarelo se 1.00 <= LC < 1.50, Vermelho se < 1.00.
  - *Rentabilidade*: Verde se ROE >= 18%, Amarelo se 8% <= ROE < 18%, Vermelho se < 8%.
  - *Endividamento*: Verde se Grau de Endividamento <= 50%, Amarelo se 50% < EG <= 75%, Vermelho se > 75%.
  - *Eficiência de Caixa*: Verde se Ciclo de Caixa <= 30 dias, Amarelo se 30 < CC <= 60 dias, Vermelho se > 60 dias.
* **Altman Z-Score Gauge (Componente SVG)**:
  - Arco com gradiente de 3 cores (Vermelho #EF4444, Amarelo #F59E0B, Verde #10B981).
  - Ponteiro angular dinâmico calibrado de Z=0 a Z=5.
  - Fatores exibidos: X1 (Capital de Giro/Ativo), X2 (Lucros Retidos/Ativo), X3 (EBIT/Ativo), X4 (PL/Passivo Total), X5 (Vendas/Ativo).
  - Fórmula: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5.

#### 2.3.2. Tab 2: Decomposição DuPont 5 Estágios & Índices Detalhados
* **DuPont 5 Estágios Tree Flow**:
  1. *Carga Tributária (Tax Burden)*: Lucro Líquido / EBT (Mede retenção pós-impostos).
  2. *Efeito Juros (Interest Burden)*: EBT / EBIT (Mede impacto do custo financeiro da dívida).
  3. *Margem Operacional (EBIT Margin)*: EBIT / Receita Líquida (Mede eficiência na operação pura).
  4. *Giro do Ativo (Asset Turnover)*: Receita Líquida / Ativo Total (Mede capacidade de gerar receita por real investido).
  5. *Multiplicador de Alavancagem (Equity Multiplier)*: Ativo Total / Patrimônio Líquido (Mede uso de capital de terceiros).
  - *Síntese*: ROE = Tax Burden * Interest Burden * EBIT Margin * Asset Turnover * Equity Multiplier.
* **Matriz de Índices Detalhados**:
  - Liquidez: Corrente, Seca, Imediata, Geral.
  - Rentabilidade: Margem Bruta, Margem EBITDA, Margem Operacional, Margem Líquida, ROA, ROE, ROI.
  - Endividamento: Grau de Endividamento Geral, Composição da Dívida (CP/LP), Cobertura de Juros.
  - Prazos e Ciclos: PME (dias), PMRV (dias), PMPF (dias), Ciclo Operacional, Ciclo de Caixa, Necessidade de Capital de Giro (NCG) e Efeito Tesoura.

#### 2.3.3. Tab 3: CFO Prescritivo & Alocação Inteligente
* **Cruzamento Contábil + Fiscal + DP**:
  - Puxa dados do officeStore (empresas, massa salarial, regime tributário) e escuta eventos do officeEventBus (economia monofásica, fechamento de folha).
* **Pareceres Prescritivos com IA (4 Caixas de Diagnóstico)**:
  - *Diagnóstico de Caixa & Liquidez*: Avaliação do caixa livre disponível e segurança para os próximos 90 dias.
  - *Eficiência Operacional & Prazos*: Renegociação de prazos médios e alinhamento de recebimento vs pagamento.
  - *Otimização Tributária*: Parecer sobre aproveitamento de créditos e enquadramento ideal.
  - *Estratégia de Dívida & Alavancagem*: Comparativo custo da dívida vs retorno dos ativos e desalavancagem.
* **Capacidade Máxima de Crédito Saudável**:
  - Regra: Limite Máximo de Dívida Bruta = 2.5 * EBITDA - Dívida Atual, desde que Liquidez Corrente Projetada >= 1.30.
* **Alocação de Caixa Livre (Free Cash Flow)**:
  - Sliders para simulação de distribuição: Reinvestimento em Expansão / CAPEX, Reserva de Contingência / NCG, e Distribuição de Dividendos Isentos aos Sócios.

#### 2.3.4. Tab 4: Simulador de Expansão & Investimentos What-If
* **Inputs Paramétricos Interativos**:
  - Sliders com debounce reativo para CAPEX (R$), Receita Adicional Mensal (R$), Margem de Custo Variável (%), Despesas Fixas Incrementais (R$), Taxa WACC (% a.a.) e Prazo (Meses).
* **Cálculos Matemáticos Determinísticos**:
  - *Margem de Contribuição Unitária / % (MC)* = 1 - Custo Variável %.
  - *Ponto de Equilíbrio Contábil (PEC)* = Custos Fixos Totais / MC.
  - *Ponto de Equilíbrio Financeiro (PEF)* = (Custos Fixos - Depreciação) / MC.
  - *Ponto de Equilíbrio Econômico (PEE)* = (Custos Fixos + Custo de Oportunidade do CAPEX) / MC.
  - *Margem de Segurança Operacional* = ((Receita Projetada - PEC) / Receita Projetada) * 100%.
  - *VPL (Valor Presente Líquido)* = Somatório [FCF_t / (1 + k)^t] - CAPEX.
  - *Payback Simples* = Mês em que Somatório FCF_t >= CAPEX.
  - *Payback Descontado* = Mês em que Somatório [FCF_t / (1 + k)^t] >= CAPEX.
  - *TIR (Taxa Interna de Retorno)* = Taxa r onde VPL = 0.

#### 2.3.5. Tab 5: Emissão de Dossiê Executivo em PDF (Padrão Diamond Champion)
* **Estrutura Visual do Dossiê A4**:
  - Padrão A4 formatado em CSS (210mm de largura, margens de 15mm, tipografia nítida 300dpi).
  - Cabeçalho Oficial do Escritório: Logomarca Soberano Contábil, Razão Social, CNPJ, CRC do Contador Responsável, Dados Cadastrais do Cliente e Período de Apuração.
  - Seções Paginadas com break-inside: avoid e page-break-after: auto:
    * 1. Sumário Executivo & Score Geral de Solvência (com Altman Z-Score).
    * 2. Quadro Resumo do Balanço Patrimonial e DRE (IFRS/CPC 26).
    * 3. Decomposição DuPont em 5 Estágios e Matriz de Indicadores.
    * 4. Pareceres Prescritivos do CFO Virtual e Recomendações de Alocação de Capital.
    * 5. Análise de Viabilidade de Investimentos (Cenários What-If).
    * 6. Bloco de Encerramento com Assinatura Digital do Contador (CRC) e do Administrador da Sociedade, com Hash SHA-256 de integridade contábil.
* **Motor de Impressão e Download**:
  - Estilização completa @media print que isola o container do Dossiê, remove Topbar, Sidebar e controles interativos, garantindo geração de PDF limpo e perfeito no diálogo nativo de impressão de qualquer navegador.

---

## 3. Caveats (Ressalvas & Limites de Escopo)
1. **Regra de Read-Only**: Esta etapa consistiu em investigação aprofundada e especificação arquitetural, sem modificar código-fonte de produção nesta sessão.
2. **Dependências Externas**: Nenhuma biblioteca externa volumosa de gráficos ou PDF (como recharts ou jspdf) é necessária nem deve ser adicionada; o design foi arquitetado com base em SVG/Canvas puros e CSS @media print nativo de altíssimo desempenho, mantendo o bundle leve e sem vulnerabilidades.
3. **Integração com Core**: O módulo consome perfeitamente as funções puras de @soberano/core (generateFinancialStatements, DoubleEntryEngine, createStandardChartOfAccounts, generateExecutiveDossier), e novos utilitários de cálculo de índices podem ser adicionados ao core ou expostos como helpers puros de TypeScript.

---

## 4. Conclusion (Conclusão & Recomendações para Implementação)

1. A arquitetura de UI para o **Módulo de Análise das Demonstrações Contábeis & Administrador Financeiro Inteligente (CFO Virtual & Hub de Tomada de Decisão Financeira)** está totalmente projetada e aderente ao padrão visual Diamond Champion do Soberano Contábil.
2. O módulo deve ser implementado como FinancialStatementAnalysisCfoView.tsx em packages/web/src/views/, subdividido nas 5 abas modulares especificadas:
   - **Tab 1**: Cockpit Executivo & Termômetro de Saúde Financeira
   - **Tab 2**: Decomposição DuPont 5 Estágios & Índices Detalhados
   - **Tab 3**: CFO Prescritivo & Alocação Inteligente (IA Decisória & Governança)
   - **Tab 4**: Simulador de Expansão & Investimentos What-If
   - **Tab 5**: Emissão de Dossiê Executivo em PDF (Preview Interativo + Download Oficial)
3. A navegação deve ser atualizada em packages/web/src/config/navigation-modules.ts e conectada em packages/web/src/App.tsx.
4. Os testes unitários e de integração de frontend devem ser implementados em packages/web/src/__tests__/financial-statement-analysis-cfo.test.ts.

---

## 5. Verification Method (Método de Verificação Independente)

Para verificar de forma autônoma e independente:

1. **Executar a suíte de testes do Vitest**:
   `ash
   npm run test
   `
   *Critério de aceitação*: 100% dos testes devem passar verdes (0 falhas).

2. **Verificar a compilação do bundle de produção**:
   `ash
   npm run build
   `
   *Critério de aceitação*: Build concluído com sucesso sem erros de tipagem TypeScript (	sc) ou empacotamento Vite.

3. **Inspecionar os arquivos de especificação**:
   - Inspecionar .agents/explorer_financial_ui_pdf/handoff.md.
   - Inspecionar .agents/explorer_financial_ui_pdf/BRIEFING.md.
