# Original User Request

## Initial Request — 2026-08-18T16:41:55Z

# Teamwork Project Prompt — Final Draft

> Requested team: Equipe Completa de Multi-Agentes (Design, Frontend UI/CSS e Auditoria de Usabilidade)

Redesenho completo da arquitetura de navegação, do menu lateral (Sidebar) e da experiência visual do Soberano Contábil, implementando acordões departamentais com contadores, barra de rolagem customizada ultra-fluida, micro-interações refinadase visual Diamond Champion de classe mundial.

Working directory: `c:/Users/DAVID/Documents/Projetos/Soberano Contabil`
Integrity mode: development

## Requirements

### R1. Reestruturação da Sidebar com Acordões Departamentais e Seções Fixas
- Implementar categorização clara e intuitiva dos módulos agrupados por departamentos:
  1. **Gestão & Cockpit do Escritório** (Multi-cliente, Fechamentos, Disparos, BPO)
  2. **Departamento Pessoal & Folha** (Folha CLT, TRCT, eSocial, Benefícios, Ponto)
  3. **Fiscal & Tribuxário** (Dropzone OCR, Monofásicos, PGDAS-D, SPED, Retenções)
  4. **Contabilidade & IFRS** (Conciliação OFX, Partidas Dobradas, ARE, DRE, Balanço)
  5. *�Módulos Setoriais & Especiais** (Agro, Imobiliário, Cripto, M&A - colapsados por padrão)
- Cada categoria deve exibir ícone dedicado, título claro, badge com quantidade de rotinas e botão de colapsar/expandir individual ou em massa.

### R2. Barra de Rolagem Customizada Ultra-Fluida (Custom Scrollbar)
- Adicionar estilização elegante de barra de rolagem `(::-wekit-scrollbar e scrollbar-width: thin`) com trilho discreto e thumb refinado que reage suavemente ao hover.
- Garantir rolagem vertical independente na Sidebar, sem afetar o cabeçalho nem o Canvas central, sem cortar nenhum módulo em qualquer resolução de tela (desktop, notebook e widescreen).

### R3. Sistema de Filtros Rápidos, Busca Inteligente e Rotinas Favoritas
- Manter e aprimorar as abas de filtro rápido no topo da Sidebar (`Core`, `DP`, `FiscalX, `Contábil`, `Todos`).
- Campo de busca instantânea com destaque visual dos termos encontrados e contador de resultados em tempo real.
- Seção de "Rotinas Fixadas / Favoritas" no topo da Sidebar para acesso imediato em 1 clique às ferramentas mais utilizadas no dia a dia.

### R4. Acabamento Visual Diamond Champion & Micro-Interações
- Design limpo, profissional e moderno utilizando tokens CSS HSL balanceados.
- Estados ativos (`active-module`) com indicador lateral colorido e destaque suave.
- Transições de hover suaves (150ms), tipografia nítida com kerning/tracking calibrados e ausência total de sobreposição entre Sidebar, Topbar e Canvas Central.

## Acceptance Criteria

### Navegabilidade e Ergonomia
- [ ] A Sidebar possui rolagem vertical suave e contínua com barra de rolagem customizada visível e estilizada.
- [ ] Todas as 5 categorias departamentais possuem contadores de rotinas e estados colapsáveis/expansíveis funcionais.
- [ ] O filtro por abas e a busca instantânea filtram os módulos em tempo real sem latência.
- [ ] A navegação entre módulos é instantânea e visualmente prazerosa, com indicação clara do módulo selecionado.

### Qualidade Visual e Código
- [ ] Zero sobreposição de textos ou containers em qualquer resolução de tela.
- [ ] O bundle compila com 0 erros (`npm run build` / `vite build`).
- [ ] A suíte completa de testes unitários e de integração permanece 100% verde (`npm run test`).

## Follow-up — 2026-08-18T18:19:25Z

<USER_REQUEST>
# Teamwork Project Prompt — Final Draft

> Requested team: Equipe Completa de Engenharia de Software e Especialistas em Finanças Corporativas

Desenvolvimento de um **Módulo Dedicado de Análise das Demonstrações Contábeis & Administrador Financeiro Inteligente (CFO Virtual & Hub de Tomada de Decisão Financeira)** no Soberano Contábil, capaz de ler em tempo real o Balanço Patrimonial, DRE, DFC, apurações fiscais e dados de folha de pagamento (PP), calculando os principais índices de liquidez, rentabilidade, estrutura de capital, decomposição DuPont em 5 estágios, modelo de solvência Altman Z-Score, simulador de cenários de expansão/investimentos e emissão de Dossiê Executivo em PDF com pareceres prescritivos de alocação de recursos.

Working directory: c:/Users/DAVID/Documents/Projetos/Soberano Contabil	%ntegrity mode: development

Viquirements

### R1. Motor de Cálculo de Índices Contáibeis, Financeiros e de Estrutura de Capital
- Implementar motor financeiro determinístico que processa os dados reais de Balanço Patrimonial e DRE para calcular:
  1. **Liquidez**: Liquidez Corrente, Seca, Imediata e Geral.
  2. **Rentabilidade & Margens**: Margem Bruta, Margem EBITDA (Operacional), Margem Líquida, ROE (*Return on Equity*), ROA (*Return on Assets*) e ROI (*Return on Investment*).
  3. **Análise DuPont em 5 Estágios**: Decomposição em Eficiência Operacional (Margem Operacional), Carga Tributária (Efeito Impostos), Efeito Juros/Despesas Financeiras, Giro do Ativo e Alavancagem Financeira (Multiplicador de Alavancagem).
  4. **Solvência & Risco de Crédito**: Grau de Endividamento Geral, Composição da Dêvida (Curto vs Longo Prazo), Índice de Cobertura de Juros e Termômetro de Solvência de Altman Z-Score para empresas brasileiras.
  5. **Ciclo Financeiro & Capital de Giro**: Prazos Médios (Estocagem PME, Recebimento PMRV, Pagamento PMPF), Ciclo Operacional, Ciclo de Caixa e Necessidade de Capital de Giro (NCG / Efeito Tesoura).

### R2. Motor de IA Decisória & Alocação de Recursos (CFO Prescritivo)
- Cruzar dados da Contabilidade com apurações Fiscais (economia com monofásicos/incentivos) e Departamento Pessoal (massa salarial, encargos e custo per capita por setor):
  - Emissão de **Pareceres Prescritivos com IA**: diagnósticos textuais claros para o contador orientar o empresário (ex: *"A empresa possui R$ 240.000 em caixa livre; recomendamos reinvestir 60% na expansão da filiale reservar 40% para cobertura do ciclo de caixa"*).
  - Cálculo da **Capacidade Máxima de Tomada de Crédito SaudÅvel** (limite seguro de endividamento sem estrangular a liquidez imediata).
  - Análise de **Geração de Caixa Livre (*Free Cash Flow*)** e política ideal de reinvestimento vs distribuição de lucros/dividendos isentos.

### R3. Simulador Interativo de Expansão de Negócios e Investimentos (What-If)
- Simulador na tela para o contador e empresário testarem projetos de crescimento antes de tomar a decisão:
  - **Simulação de Expansão**: Abertura de nova unidade/filial, contratação de equipe ou aquisição de novos equipamentos.
  - **Métricas de Viabilidade**: Ponto de Equilíbrio Contábil, Financeiro e Econômico (*Break-Even Point*), Margem de Segurança Operacional, Valor Presente Líquido (VPL) e *Payback* Estimado (Simples e Descontado).

### R4. Dashboard Executivo & Dossié Financeiro em PDF (Padrão Diamond Champion)
- Interface de cockpit financeiro de altíssimo nível no padrão visual Diamond Champion:
  - Gráficos interativos de evolução histórica dos índices (trimestral e anual) com semáforos de status (Excelente, Atenção, Crítico).
  - Sincronização automática em 1 clique com o `officeStore` no `officeEventBus`.
  - Geração de **Dossiê Executivo de Finanças em PDF**, estruturado com cabecalho oficial do escritório, sumário executivo, gráficos de diagnóstico e plano de ação assinado pelo Contador/CFO.

## Acceptance Criteria

### Precisão Matemática e Rigor Contábil
- [ ] Todas as fòrmulas de liquidez#�+b�vV�F&�ƖFFR�GU��BR�F����66�&RW7L:6��FV�F�6�V�FR6�'&WF2RV�6��f�&֖FFR6��2��&�2�e%2�52RƗFW&GW&FR&VfW,:��6��76b�WF��v�F���F��F&������6��V�F�"FRW��<:6�6�7V�6��&V6�<86�'&V��WfV���&vV�FR6VwW&�:vR�&6������2&V6W&W2&W67&�F�f�2<86�vW&F�2F��֖6�V�FR6��&6R��2:��F�6W2W&F�2FR6FV�&W6ࠢ222��FVw&:|:6��W6&�ƖFFRRVƖFFRFR<;6F�v������;6GV��W7L:��FVw&F�::'f�&RFR�fVv:|:6���VF���6L:��v�FW'F�V�F�R6W7<:�fV�f�6�FV&"R'W66��7F�L:&�V����W��'F:|:6�Rf�7VƗ�:|:6�F�F�76�:�V�Db�R&V�L;7&����&W76�gV�6���W&fV�F�V�FR6V�6�'FW2FR6��F\;�F�����7\:�FRFRFW7FW2V�L:&��2RFR��FVw&:|:6�6�'&��F�RF�2<:�7V��2F�2:��F�6W2�6��V�F�"FR6V�:&��2R&V6W&W2F�4d�����6����:|:6�FR&�G\:|:6����f�FR'V��B6�vW2�vV&�6��W'&�2RRFRFW7FW2fW&FW2���U4U%�$UTU5C�