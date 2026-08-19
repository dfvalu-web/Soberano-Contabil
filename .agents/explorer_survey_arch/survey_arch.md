# Relatório de Levantamento Arquitetural de Navegação (Explorer 1)
**Projeto:** Soberano Contábil — Platinum Suite Enterprise v4.3  
**Data:** 18 de Agosto de 2026  
**Autor:** Explorer 1 (Navigation Architecture & Structure)  
**Status:** Concluído / Pronto para Handoff  

---

## 1. Sumário Executivo

Este documento apresenta o levantamento completo da arquitetura de navegação, roteamento de módulos, gerenciamento de estado e distribuição de componentes do **Soberano Contábil**.

O objetivo primordial é subsidiar a reestruturação da **Sidebar** e da **Navegação Global** para atender aos requisitos **R1** (Acordões Departamentais), **R2** (Custom Scrollbar fluida), **R3** (Filtros Rápidos, Busca Inteligente e Favoritos) e **R4** (Visual Diamond Champion & Micro-interações) estipulados no `ORIGINAL_REQUEST.md`.

---

## 2. Mapa Estrutural dos Componentes de Layout

Atualmente, o layout principal está concentrado de forma monolítica no arquivo `packages/web/src/App.tsx` (2.147 linhas), com estilização centralizada em `packages/web/src/index.css` (417 linhas) e estado operacional de negócio em `packages/web/src/state/office-store.ts` (621 linhas).

### 2.1. Localização Exata dos Componentes

| Componente | Localização Exata | Elemento Raiz / Classe | Responsabilidade Principal |
| :--- | :--- | :--- | :--- |
| **Topbar Global** | `packages/web/src/App.tsx:1443-1660` | `<header className="app-topbar-global">` | Identidade Soberano ERP Master, Breadcrumbs dinâmicos, Seletor de Competência (mês/ano), Badges de status dos WebServices Gov (SEFAZ/eSocial), Seletor de Empresa Ativa (Tenant) com status CND, Botão "1-Click Fechamento" e Toggle do Copiloto IA. |
| **Sidebar Esquerda** | `packages/web/src/App.tsx:1669-1784` | `<aside className="app-sidebar-left">` | Campo de busca com botão limpar, contador de visíveis, botões Expandir/Recolher em massa, Acordões de categorias/módulos com badges de contagem e botão de toggle, e rodapé com status de compilação/testes. |
| **Workspace Central (Canvas)** | `packages/web/src/App.tsx:1788-2004` | `<main className="app-center-workspace">` | Barra horizontal de pílulas de filtro (`.category-filter-bar`) e renderização condicional dos 181 componentes de visão (`.view-card-container`). |
| **Right Deck (Copiloto IA)** | `packages/web/src/App.tsx:2009-2140` | `<aside className="app-right-deck">` | Painel retrátil com Semáforo de Fechamento em tempo real, Diagnóstico Forense IA, Ações Rápidas 1-Click e Protocolos Digitais SHA-256 ICP-Brasil. |
| **Container Global** | `packages/web/src/App.tsx:1439-2143` | `<div className="app-container">` / `<div className="app-body-layout">` | Layout em 3 zonas (Header fixo + Corpo flexível com Sidebar 280px + Canvas 1fr + Right Deck 320px). |

---

## 3. Arquitetura de Estado da Navegação

### 3.1. Variáveis de Estado Atuais (`App.tsx`)

| Estado | Tipo | Valor Padrão | Função |
| :--- | :--- | :--- | :--- |
| `currentModuleId` | `string` | `'office_multi_client_grid'` | ID do módulo em exibição no Canvas central e destacado na Sidebar. |
| `searchQuery` | `string` | `''` | Termo de busca textual para filtragem instantânea em tempo real. |
| `selectedCategoryTab` | `string` | `'CORE'` | Tag de filtro rápido ativa (ex.: `'CORE'`, `'DP'`, `'TODOS'`). |
| `collapsedCategories` | `{ [key: string]: boolean }` | `{ 'Módulos Setoriais & Especiais...': true }` | Mapa booleano de estado de colapso de cada acordão de categoria. |
| `isSidebarOpen` | `boolean` | `true` | Controle de visibilidade/recolhimento da Sidebar esquerda. |
| `isRightDeckOpen` | `boolean` | `true` | Controle de visibilidade/recolhimento do painel Copiloto à direita. |
| `selectedTenant` | `string` | `'Soberano Tech S/A'` | Tenant/empresa selecionada no contexto global. |
| `selectedCompetencia` | `string` | `'08/2026'` | Competência fiscal/contábil ativa. |

### 3.2. Lacunas Identificadas no Gerenciamento de Estado

1. **Ausência de Estado de Favoritos / Rotinas Fixadas (`pinnedModuleIds` / `favoriteModuleIds`):**
   - Não existe persistência nem lista de rotinas favoritas no topo da Sidebar.
   - **Solução Arquitetural:** Implementar estado `favoriteModuleIds: string[]` com persistência em `localStorage['soberano_favorite_modules']` e valores padrão recomendados (`office_multi_client_grid`, `office_universal_dropzone_ocr`, `payroll`, `office_monophasic_tax`, `accounting`).
2. **Destaque Visual de Busca (Match Highlighting):**
   - A busca atual apenas filtra os itens via `.filter()`, mas não destaca visualmente o termo buscado dentro do rótulo do módulo.
   - **Solução Arquitetural:** Criar helper de renderização que envelopa substrings correspondentes com `<mark className="search-highlight">` ou tag estilizada.
3. **Desacoplamento de Filtros Rápidos:**
   - As pílulas de filtro rápido estão no topo do Canvas Central, enquanto o `ORIGINAL_REQUEST.md` requer alinhamento e filtros rápidos no topo da Sidebar / Canvas integrados por departamentos.

---

## 4. Análise e De-Para: Categorias Atuais vs 5 Departamentos Obrigatórios

Atualmente, o catálogo conta com **181 rotinas/módulos** cadastrados no array `CATEGORIES` (`App.tsx:199-1358`), divididos em **9 categorias legadas**.

Abaixo detalhamos o mapeamento completo e a reorganização nos **5 Departamentos Oficiais do Soberano Contábil**:

```
                                  SOBERANO CONTÁBIL (181 Módulos)
                                                 │
        ┌───────────────────┬────────────────────┼───────────────────┬────────────────────┐
        ▼                   ▼                    ▼                   ▼                    ▼
1. Gestão & Cockpit  2. DP & Folha        3. Fiscal & Trib.   4. Contabilidade     5. Setoriais & Esp.
   do Escritório        (16 Módulos)         (26 Módulos)        & IFRS (15 Mód.)     (100 Módulos)
   (24 Módulos)
```

### 4.1. Tabela Detalhada de Mapeamento Departamental

#### 🏛️ Departamento 1: Gestão & Cockpit do Escritório (24 Módulos)
*Tag: `GESTAO` | Ícone: `🏛️` | Status Inicial: Expandido*
- `office_multi_client_grid` — Cockpit Multi-Empresa em Grade (🚦)
- `office_universal_dropzone_ocr` — Dropzone Massivo Multi-Doc OCR (📂)
- `office_batch_dispatch_bundle` — Disparo em Lote 1-Click (Guias/Pix) (🚀)
- `dashboard` — Cockpit Executivo Principal (📊)
- `accounting_office_hub` — Central do Escritório (4 Pilares) (🏛️)
- `office_daily_operations` — Operações Diárias (3 Pilares) (⚙️)
- `office_monthly_closing` — Fechamento Mensal & Dossiê (🗓️)
- `office_tasks_productivity` — Tarefas & SLAs da Equipe (📋)
- `office_client_profitability_bi` — BI & Rentabilidade da Carteira (📈)
- `client_portal_office` — Portal do Cliente (B2B) (🌐)
- `financial_bpo_office` — BPO Financeiro & Fluxo de Caixa (💼)
- `corporate_legalization_cnd` — Legalização & Gestão de CNDs (📜)
- `office_redesim_viability` — Viabilidade Redesim & Licenças (🏢)
- `office_family_holding` — Holding Familiar & Sucessão (🏰)
- `office_strategic_valuation` — Valuation & Advisory Estratégico (🎯)
- `office_corporate_governance` — Governança & Atas Digitais (⚖️)
- `office_fees_billing` — Honorários & Cobrança Escritório (🧾)
- `office_client_onboarding` — Onboarding & Migração Clientes (🚀)
- `office_electronic_attorney` — Procurações e-CAC & DJE (⚖️)
- `security` — Segurança & Ledger ACID (🛡️)
- `office_digital_certificates` — Certificados Digitais & Assinador (🔐)
- `cloud_hsm_pfx_vault` — Cloud HSM & Cofre PFX A1 (🔒)
- `office_aml_coaf` — Prevenção PLD & COAF / CFC (🚨)
- `gov_webservices_prod` — WebServices Gov em Produção (🔌)
- `sefaz_k8s_prod` — SEFAZ mTLS & Transmissão Segura (☸️)

#### 👥 Departamento 2: Departamento Pessoal & Folha (16 Módulos)
*Tag: `DP` | Ícone: `👥` | Status Inicial: Expandido*
- `payroll` — Folha de Pagamento Central & Encargos (👥)
- `office_labor_termination` — Rescisão Trabalhista & TRCT 1-Click (📄)
- `office_absence_dsr_vacation` — Faltas Injustificadas & Férias CLT (⏱️)
- `office_hazardous_work` — Insalubridade & Periculosidade (NR-15/16) (☣️)
- `office_flexible_benefits_pat` — Benefícios Flexíveis, VT & PAT (🍱)
- `office_cprb_payroll_relief` — Desoneração da Folha (CPRB) (📉)
- `office_alimony_child_support` — Pensão Alimentícia Judicial (⚖️)
- `office_overtime_night_dsr` — Horas Extras, Noturno & DSR (⏰)
- `office_payroll_esocial_audit` — Auditoria Folha & eSocial (🛡️)
- `office_sst_esocial` — SST eSocial & PPP Digital (🦺)
- `office_vacation_leaves` — Férias & Controle de Ponto (🏖️)
- `office_payroll_provisions` — Provisões de Férias e 13º Salário (📊)
- `office_internship_apprentice_audit_view` — Estágio & Jovem Aprendiz (🎓)
- `office_job_tenure_stability_inss_view` — Estabilidade Emprego & INSS (🛡️)
- `port_workers_fap_payroll_view` — Trabalhadores Portuários & FAP (⚓)
- `pension_defined_benefit_admission_active_view` — Benefício Definido Previdência (🏛️)

#### ⚖️ Departamento 3: Fiscal & Tributário (26 Módulos)
*Tag: `FISCAL` | Ícone: `⚖️` | Status Inicial: Expandido*
- `office_monophasic_tax` — Monofásicos PIS/COFINS (Farmácias) (💊)
- `office_card_pix_crossaudit` — Cruzamento Cartões/PIX vs DF-e (💳)
- `office_returns_tax` — Devoluções & Estornos de Crédito (🔄)
- `office_inventory_block_hk` — Estoques & SPED Bloco H/K (📦)
- `office_dda_matching` — DDA Bancário vs Notas de Entrada (📑)
- `office_inbound_dfe` — DF-e Entrada & Manifestação SEFAZ (📥)
- `office_state_ancillary` — Obrigações Estaduais (GIA/DeSTDA) (🏛️)
- `warranty_difal_fcp` — DIFAL & Fundo de Combate à Pobreza (🛡️)
- `office_ciap_block_g` — CIAP Bloco G SPED (1/48 Avos) (🏗️)
- `office_fixed_assets_ciap` — Ativo Imobilizado Fabril (🏭)
- `office_tax_credit_recovery` — Recuperação Créditos PIS/COFINS (💎)
- `office_tax_reform_transition` — Reforma Tributária IBS/CBS Fabril (⚖️)
- `office_tax_arrears` — Recálculo de Tributos em Atraso (⏱️)
- `office_perdcomp_negative_balance` — PER/DCOMP & Saldos Negativos (📑)
- `office_optimal_prolabore` — Pró-Labore & Fator R (28%) (💰)
- `office_federal_tax_withholding` — Retenções Federais (CSRF 4,65%) (🏛️)
- `office_issqn_withholding` — ISS Tomador & CPOM Municipal (🏙️)
- `office_reinf_r4000` — EFD-Reinf R-4000 & DCTFWeb (📋)
- `office_tax_withholdings` — Retenções na Fonte & Comprovantes (📑)
- `office_carne_leao_irpf` — Carnê-Leão & Livro Caixa IRPF (🦁)
- `tax` — Simulador Tributário (3 Regimes) (🧮)
- `office_fiscal_document_ocr_view` — OCR Documentos Fiscais & Extratos (📄)
- `office_tax_discrepancies_notifications_view` — Notificações & Malhas Fiscais (⚠️)
- `office_tax_incentives_donation_view` — Incentivos Fiscais & Doações (🎁)
- `office_tax_installments_pgfn_view` — Parcelamentos Fiscais PGFN / RFB (📑)
- `office_annual_tax_planning_view` — Planejamento Tributário Anual (🎯)

#### 📚 Departamento 4: Contabilidade & IFRS (15 Módulos)
*Tag: `CONTABIL` | Ícone: `📚` | Status Inicial: Expandido*
- `accounting` — Contabilidade IFRS & Razão Digital (📖)
- `office_annual_closing_are` — Custos CPV & ARE Anual 1-Click (🏁)
- `office_annual_closing` — Fechamento Anual & Notas Explicativas (📊)
- `office_equity_method_cpc18` — Equivalência Patrimonial (MEP - CPC 18) (🏢)
- `office_ecd_ecf_junta` — ECD, ECF & Livros Junta Comercial (🏛️)
- `sped` — Suíte SPED & Validador PVA (📄)
- `office_sped_batch_prevalidator` — Pré-Validador SPED em Lote (🔍)
- `dfe` — Auditoria DF-e & Malhas Fiscais (⚡)
- `dfc_merger` — DFC Demonstração Fluxos de Caixa (🌊)
- `dva_wealth_jcp` — DVA Demonstração Valor Adicionado (💎)
- `treasury_demonstration_view` — Demonstração de Tesouraria & Fluxo Direto (💵)
- `first_time_ifrs_reiq_tax_view` — Adoção Inicial IFRS CPC 37 / REIQ (🌟)
- `esg_ifrs_globe_tax_view` — Relatórios ESG & IFRS S1/S2 (🌿)
- `office_annual_dossier_audit_opinion_view` — Dossiê Anual & Parecer de Auditoria (📋)
- `forensic_ai_view` — Perícia Contábil Forense & Benford (🔬)

#### 🌐 Departamento 5: Módulos Setoriais & Especiais (100 Módulos)
*Tag: `SETORIAL` | Ícone: `🌐` | Status Inicial: Colapsado por Padrão*
- **Agro & Pecuária:** `agri_derivatives`, `cattle_agro_lcdpr`, `bearer_plants_agro`, `biological_fco_tax`, `agro_cpr_psr`, `forestry_biological_debt`, `foreign_currency_agro_pis_cofins_view`, `fidc_cpr_agro`
- **Cripto & DREX:** `drex_cbdc_tpft`, `rwa_tokens_ibs_cbs`, `crypto_vasp_in1888`, `borrowing_crypto`, `crypto_natural_gas`
- **M&A, Carve-outs & Internacional:** `earnout_sugarcane`, `carveout_zfm_tax`, `cross_border_ma_safe_harbor_view`, `beps_globe_qdmtt_tax_treaty_view`, `goodwill_toll`, `separate_offshore`, `open_finance_audit_cross_view`
- **Imobiliário, FIIs & Construção:** `shopping_mall_fii_tax`, `fractional_multipropriedade_ret`, `lessor_construction`, `poc_leasing`, `insurance_fii`, `investment_warehouse`
- **ZFM, ALC, Aduaneiro & Comex:** `zfm40_suframa_pin`, `segments_amazon_alc`, `distribution_alc`, `software_oea_customs`, `drawback_aap`, `intercompany_drawback`, `capital_markets`, `interim_reporting_recof_sped_view`
- **Energia, Petróleo, Portos & Concessões:** `ccee_energy_tp`, `methane_carbon_port_tax`, `port_tup_storage_tax`, `common_control_oil`, `telemetry_repetro`, `liquidation_afrmm`, `guarantee_fuels`, `concession_hospital`, `hybrid_concession_vehicles`, `naval_shipbuilding`, `resurfacing_cinema`
- **Carbono & ESG:** `carbon_cbio`, `sbce_carbon_redd`, `queue_esg`
- **Finanças & Mercado de Capitais:** `infrastructure_debentures`, `hybrid_perpetual_reidi_tax`, `borrowing_lei_do_bem`, `ndf_hedge_split_payment`, `grants_cide`, `phantom_swap`, `stock_options_sped_export_view`, `medical_cooperative_tax`, `bets_cooperatives_tax`, `loans_cooperative`
- **Indústrias Especiais & Infra:** `streaming_lease_ifrs`, `sudene_maintenance_overhaul`, `weather_ipi_export`, `perpetual_autoparts`, `uncertainty_beverages`, `onerous_cosmetics`, `compound_recycling`, `revaluation_biodiesel`, `regulatory_ev_mover`, `embedded_freight`, `tax_loss_saas`, `insurance_telecom`, `benefits_ret`, `discontinued_future`, `policies_triangular`, `mineral_trading`, `intangibles_returns`, `aro_bonification`, `interim_mover`, `consolidation_consignment`, `control_tower_ocr_ledger_view`, `corporate_sso_govbr_mfa_view`, `dfc_compounding_view`, `distributed_queue_whatsapp_alerts_view`, `enterprise_production_command_center_view`, `first_time_insurance_paa_view`, `hyperinflation_iof_view`, `kms_parties_grants_view`, `office_smart_dropzone_triage_view`, `office_state_of_the_art_daily_automation_view`, `postgres_multi_tenant_rls_view`, `postgres_pgvector_otel_prometheus_view`, `pva_compliance_soc2_security_view`, `soc2_iso_drp_lgpd_audit_view`, `actuarial_pharma`.

---

## 5. Especificação Técnica dos Recursos de Navegação (R1, R3, R4)

### 5.1. Acordões Departamentais com Contadores
- Cada um dos 5 departamentos possui um header (`category-btn`) contendo:
  1. Ícone exclusivo em alta definição.
  2. Título departamental em tipografia calibrada (`font-weight: 700`).
  3. Badge numérico com contagem de rotinas (`badge-pill`), colorido conforme o departamento.
  4. Seta indicativa de colapso/expansão com rotação suave via CSS (`transition: transform 150ms ease`).
- Suporte a:
  - **Toggle individual:** clique no cabeçalho inverte o estado do acordão correspondente.
  - **Expandir Todos:** expande os 5 departamentos em 1 clique.
  - **Recolher Todos:** colapsa todos os departamentos em 1 clique.

### 5.2. Seção de Rotinas Fixadas / Favoritas (1-Click)
- Localizada no topo da lista navegável, imediatamente abaixo da barra de pesquisa e filtros rápidos.
- Header com ícone ⭐ "Rotinas Fixadas / Favoritas" e badge com quantidade de itens fixados.
- Itens exibidos em botões compactos ou pílulas elegantes com ícone, nome e botão de desfavoritar rápido.
- Estado persistido em `localStorage['soberano_favorite_modules']`.

### 5.3. Sistema de Busca Instantânea com Destaque
- `input` com ícone 🔍, placeholder "Buscar rotina ou módulo..." e botão `✕` para limpar.
- Filtra instantaneamente por:
  - `label` do módulo
  - `id` do módulo
  - `category`
  - `tag`
- Contador de resultados em tempo real: `Visíveis: X de 181`.
- Ao digitar na busca:
  - Os acordões com correspondências são expandidos automaticamente.
  - O texto correspondente recebe destaque visual com contraste balanceado.

### 5.4. Abas de Filtro Rápido
Pílulas de filtro acessíveis com contadores dinâmicos:
- `⭐ Favoritos`
- `💎 Core (75)` (Gestão + DP + Fiscal + Contábil)
- `🏛️ Gestão (24)`
- `👥 DP (16)`
- `⚖️ Fiscal (26)`
- `📚 Contábil (15)`
- `🌐 Setoriais (100)`
- `🔍 Todos (181)`

---

## 6. Proposta de Modularização e Organização do Código

Para manter alta manutenibilidade, elegância de código e facilidade de extensão sem quebrar testes:

1. **Configuração de Navegação:**
   - Criar `packages/web/src/config/navigation-modules.ts` exportando a lista oficial dos 5 departamentos tipada (`DepartmentCategoryGroup[]`), a lista plana de todos os módulos (`ALL_MODULES: ModuleItem[]`) e utilitários de busca/filtro.
2. **Componente de Sidebar Refatorado:**
   - `packages/web/src/components/SidebarNavigation.tsx` (ou componentes co-localizados) gerenciando pesquisa, favoritos, acordões departamentais e contadores.
3. **Componente de Topbar Refatorado:**
   - `packages/web/src/components/GlobalTopbar.tsx` mantendo tenant, competência, breadcrumbs e ações rápidas.
4. **App.tsx Limpo e Integrado:**
   - `App.tsx` integrando os módulos refatorados, preservando todas as importações de views e os 437 testes do monorepo 100% verdes.

---

## 7. Verificação de Integridade e Build

- **Build Vite:** `npx vite build packages/web` compila sem erros (0 warnings bloqueantes).
- **Testes Vitest:** `npm test` executa 86+ suítes de testes unitários e de integração mantendo 100% de sucesso.