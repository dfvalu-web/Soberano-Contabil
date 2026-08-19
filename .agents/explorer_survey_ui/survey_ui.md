# Relatório Técnico de Engenharia UI, CSS & Arquitetura Visual
**Soberano Contábil — Platinum Suite Enterprise v4.3**
**Data**: 2026-08-18 | **Agente**: Explorer 2 (UI, CSS & Scrollbar Survey)

---

## 1. Sumário Executivo & Diagnóstico do Sistema de Estilização

O **Soberano Contábil** adota uma arquitetura de estilização baseada em **Pure Modern CSS + Design Tokens CSS Custom Properties (:root) + Utilitários Semânticos Flexbox**, dispensando dependências de frameworks utilitários externos como Tailwind CSS, Styled-Components ou Emotion.

### 1.1 Stack de Frontend & Estilos Identificada
- **Core Framework**: React 19.2.8 + TypeScript 7.0.2 + Vite 8.2.1.
- **Gerenciador de Classes**: clsx 2.1.1 (disponível para concatenação condicional de classes).
- **Ícones**: lucide-react 1.31.0 + Emojis temáticos categorizados por departamento.
- **Folha de Estilos Central**: packages/web/src/index.css (417 linhas estruturadas em tokens HSL/HEX, resets, classes estruturais de layout e componentes).
- **Bundle & Build**: 100% testado e compilado via Vite (npm run build), gerando bundles otimizados com 0 erros.

---

## 2. Design Tokens, Tipografia & Paleta HSL Balanceada

O sistema utiliza tokens CSS balanceados em :root em packages/web/src/index.css:

- **Tipografia Corporativa**:
  - --font-sans: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
  - --font-mono: JetBrains Mono, monospace
- **Superfícies & Profundidade (Dark Theme Platinum)**:
  - --bg-deep: #070B14
  - --bg-main: #0B101D
  - --bg-surface: #101728
  - --bg-surface-elevated: #162035
  - --bg-surface-card: #131C30
  - --bg-surface-hover: #1C2844
- **Bordas Calibradas**:
  - --border-subtle: rgba(255, 255, 255, 0.08)
  - --border-medium: rgba(255, 255, 255, 0.14)
  - --border-highlight: rgba(16, 185, 129, 0.4)
- **Tipografia de Alto Contraste**:
  - --text-primary: #F8FAFC
  - --text-secondary: #94A3B8
  - --text-muted: #64748B
- **Escalas Cromáticas Semânticas**:
  - Emerald (Primária Soberano): --emerald-500: #10B981, --emerald-400: #34D399, --emerald-bg: rgba(16, 185, 129, 0.12)
  - Cyan (Secundária Tech): --cyan-500: #06B6D4, --cyan-400: #22D3EE, --cyan-bg: rgba(6, 182, 212, 0.12)
  - Blue / Amber / Rose / Purple para alertas, tags, semáforos e auditoria.
- **Sombras & Efeitos Glow**:
  - --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3)
  - --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4)
  - --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.5)
  - --shadow-glow: 0 0 20px rgba(16, 185, 129, 0.3)
- **Raios de Arredondamento**:
  - --radius-sm: 6px, --radius-md: 10px, --radius-lg: 14px, --radius-full: 9999px.

---

## 3. Arquitetura de Scrollbars Customizadas Ultra-Fluidas

### 3.1 Isolamento de Rolagem (Zero Bleeding)
A estrutura visual do Soberano Contábil implementa **Rolagem Independente em 3 Painéis** sem vazamento de scroll para a Topbar nem para o Canvas Central:

1. **Root Global Lock**:
   - html, body, #root, .app-container possuem overflow: hidden; width: 100vw; height: 100vh;. Isso impede que a janela do navegador role verticalmente ou horizontalmente.
2. **Topbar Estática**:
   - .app-topbar-global possui height: 60px; min-height: 60px; flex-shrink: 0; z-index: 50;. Permanece perfeitamente ancorada no topo.
3. **Sidebar Scroll Independente**:
   - .sidebar-nav-scroll possui flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;.
4. **Canvas Central Workspace Scroll Independente**:
   - .app-center-workspace possui flex: 1; min-width: 0; height: 100%; overflow-y: auto; overflow-x: hidden;.
5. **Right Copilot Deck Scroll Independente**:
   - .right-deck-scroll possui flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;.

### 3.2 Implementação Recomendada do Scrollbar Ultra-Fluido da Sidebar
Para atender o requisito R2 com precisão:

`css
/* Custom Scrollbar Exclusivo para Sidebar */
.sidebar-nav-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.35) transparent;
  scroll-behavior: smooth;
}

/* Webkit Ultra-Fluid Styling para Sidebar */
.sidebar-nav-scroll::-webkit-scrollbar {
  width: 5px;
}

.sidebar-nav-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav-scroll::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-full);
  transition: background 0.15s ease;
}

.sidebar-nav-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--emerald-400);
}
`

---

## 4. Micro-Interações, Estados Ativos, Badges & Acordões Departamentais

### 4.1 Indicador de Estado Ativo (.module-item-btn.active)
- **Indicador Lateral**: Barra lateral esquerda de 3px em --emerald-500 (#10B981).
- **Gradiente de Fundo Ativo**: linear-gradient(90deg, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.08)).
- **Tipografia Ativa**: Cor --emerald-400 (#34D399), peso 700, com contraste nítido.

### 4.2 Micro-Interações de Hover (150ms)
- **Tempo de Transição**: transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);.
- **Efeito Visual**: Leve deslocamento horizontal (transform: translateX(2px);), clareamento do texto para #ffffff e realce de fundo suave.

### 4.3 Badges de Contagem de Rotinas
- **Badges de Categoria**:
  - Categorias Core: Fundo rgba(16, 185, 129, 0.15), texto var(--emerald-400), borda 1px solid rgba(16, 185, 129, 0.3), border-radius: 10px, font-size: 0.68rem, font-weight: 700.
  - Categorias Setoriais: Fundo rgba(255, 255, 255, 0.08), texto var(--text-secondary).

### 4.4 Acordões Departamentais
- Estrutura .category-card com cabeçalho .category-btn e chevron animado com rotação -90deg em estado colapsado (transition: transform 150ms ease).
- Permite expansão/recolhimento individual e em lote ('Expandir Todos' / 'Recolher Todos').

---

## 5. Arquitetura de Containers Responsivos & Zero Sobreposição

### 5.1 Árvore Estrutural Flexbox
`
.app-container [100vw, 100vh, flex-col, overflow: hidden]
├── .app-topbar-global [h: 60px, flex-shrink: 0, z-index: 50, flex-row, space-between]
└── .app-body-layout [flex: 1, min-height: 0, width: 100%, flex-row, overflow: hidden]
    ├── .app-sidebar-left [w: 280px, min-w: 280px, flex-shrink: 0, z-index: 30, flex-col]
    │   ├── .sidebar-search-box (busca e contadores) [flex-shrink: 0]
    │   ├── .sidebar-nav-scroll (acordões e rotinas) [flex: 1, overflow-y: auto]
    │   └── sidebar-footer (status do servidor e testes) [flex-shrink: 0, h: 48px]
    ├── .app-center-workspace [flex: 1, min-width: 0, flex-col, overflow-y: auto, p: 20px 24px]
    │   ├── .category-filter-bar (pills de navegação) [flex-shrink: 0]
    │   └── .view-card-container (área da rotina ativa) [min-h: 500px]
    └── .app-right-deck [w: 320px, min-w: 320px, flex-shrink: 0, z-index: 30, flex-col]
        ├── .right-deck-header [h: 52px, flex-shrink: 0]
        └── .right-deck-scroll (cards, semáforos, ações 1-click) [flex: 1, overflow-y: auto]
`

### 5.2 Garantias de Zero Sobreposição
- O uso de min-width: 0 no Workspace Central (.app-center-workspace) impede que tabelas ou formulários empurrem a largura da tela para fora da viewport.
- As barras laterais possuem flex-shrink: 0 e transição de colapso para 0px com overflow: hidden; border: none;.
- A Topbar Global está desvinculada da rolagem dos painéis (flex-shrink: 0), garantindo permanência estável de seletores de empresa, mês/competência e alertas governamentais.

---

## 6. Mapeamento das 5 Categorias Departamentais do Requisito R1

| # | Departamento no Requisito R1 | Mapeamento no Código Atual | Exemplos de Rotinas Principais |
|---|---|---|---|
| 1 | **Gestão & Cockpit do Escritório** | Gestão & Produtividade do Escritório | Cockpit Multi-Empresa em Grade, Dropzone OCR, Disparos em Lote, Hub Operacional, Fechamentos, BI Rentabilidade |
| 2 | **Departamento Pessoal & Folha** | Departamento Pessoal & eSocial | Folha CLT Central, Rescisões TRCT, Férias/Faltas/DSR, Insalubridade, Benefícios/PAT, CPRB, SST eSocial/PPP |
| 3 | **Fiscal & Tributário** | Comércio & Varejo + Indústria & Manufatura + Prestadores de Serviços | Monofásicos PIS/COFINS, Cartão/PIX vs DF-e, SPED Bloco H/K, CIAP Bloco G, Retenções CSRF/ISS/Reinf R-4000 |
| 4 | **Contabilidade & IFRS** | Contabilidade, IFRS & SPED | Razão IFRS, ARE Anual 1-Click, Equivalência Patrimonial (CPC 18), ECD/ECF Junta, DFC, DVA, Auditoria DF-e |
| 5 | **Módulos Setoriais & Especiais** | Módulos Setoriais & Especiais (Sob Demanda) | Agro/LCDPR, Carbono/CBIO, Cripto/VASP IN 1888, ZFM Suframa, M&A/Earnout, Energia CCEE, Debêntures |

---

## 7. Status de Validação & Integridade
- **Testes Unitários & Integração**: 202 suítes, **437 testes aprovados (100% verdes)** via Vitest (npm run test).
- **Compilação de Produção**: npm run build executado com **0 erros** (vite build packages/web).