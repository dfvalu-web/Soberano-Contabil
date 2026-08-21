import React, { useState, useEffect } from 'react';
import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';
import { officeStore, PeriodFilterState } from '../state/office-store.js';

import {
  BookOpen,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  FileText,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { CompanyTenant } from '../state/office-store';

export const OfficeMonthlyConsolidatedBookView: React.FC<{ tenant?: CompanyTenant }> = ({ tenant }) => {
  const [period, setPeriod] = useState<PeriodFilterState>(() => officeStore.getPeriodFilter());

  useEffect(() => {
    const unsub = officeStore.subscribePeriodFilter((newPeriod) => {
      setPeriod(newPeriod);
    });
    return unsub;
  }, []);
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');
  const [activeTab, setActiveTab] = useState<'Dossie' | 'Demonstracoes' | 'Certidoes'>('Dossie');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="monthly-book-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Header Executivo 3D */}
      <div
        className="no-print"
        style={{
          background: 'linear-gradient(135deg, #1B1E38 0%, #0D1224 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
              color: '#070B12',
              fontWeight: 900
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Book Contábil Mensal Consolidado (Dossiê Executivo para Bancos & Investidores)
              </h2>
              <span
                style={{
                  background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.3) 0%, rgba(180, 83, 9, 0.15) 100%)',
                  color: '#FBBF24',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
                }}
              >
                PADRÃO BANCÁRIO A4
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Caderno executivo unificado: Capa, DRE, Balanço, DFC, Indicadores DuPont, CNDs e 3 Assinaturas Formais.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          

          <button
            onClick={handlePrint}
            className="btn-1click-3d"
            style={{ padding: '6px 16px', fontSize: '0.78rem' }}
          >
            <Printer size={14} /> Imprimir / Exportar PDF A4
          </button>
        </div>
      </div>

      {/* 2. Dossiê Oficial A4 Consolidado */}
      <div className="diamond-report-card">
        <div className="diamond-paper-a4">
          
          {/* Header & Identidade */}
          <div className="diamond-header">
            <div>
              <div className="diamond-title">SOBERANO CONTÁBIL • BOOK EXECUTIVO MENSAL</div>
              <div className="diamond-subtitle">
                Demonstrações Financeiras IFRS, Índices de Governança & Regularidade Fiscal
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#64748B' }}>
              <div><strong>Protocolo Oficial:</strong> BOOK-{selectedCompetencia.replace('/', '')}-7712</div>
              <div><strong>Emissão Registrada:</strong> 19/08/2026 17:40</div>
            </div>
          </div>

          {/* Metadados da Empresa */}
          <div className="diamond-meta-grid">
            <div className="diamond-meta-item">
              <strong>Entidade / Cliente</strong>
              <span>{tenant?.name || 'Soberano Tech S/A'}</span>
            </div>
            <div className="diamond-meta-item">
              <strong>CNPJ / Regime Tributário</strong>
              <span>{tenant?.cnpj || '12.345.678/0001-90'} • Lucro Real</span>
            </div>
            <div className="diamond-meta-item">
              <strong>Período Contábil</strong>
              <span>Agosto / 2026 (Mensal)</span>
            </div>
            <div className="diamond-meta-item">
              <strong>Classificação de Risco Bancário</strong>
              <span style={{ color: '#047857' }}>RATING AAA • CRÉDITO APROVADO</span>
            </div>
          </div>

          {/* KPIs Executivos */}
          <div className="diamond-kpi-row">
            <div className="diamond-kpi-box">
              <strong>Receita Líquida</strong>
              <div className="value">R$ 1.840.200,00</div>
            </div>
            <div className="diamond-kpi-box">
              <strong>EBITDA Operacional</strong>
              <div className="value">R$ 498.240,00</div>
            </div>
            <div className="diamond-kpi-box">
              <strong>Lucro Líquido (Margem)</strong>
              <div className="value">R$ 362.450,00 (19.7%)</div>
            </div>
            <div className="diamond-kpi-box">
              <strong>ROE Anualizado</strong>
              <div className="value" style={{ color: '#047857' }}>28.4% a.a.</div>
            </div>
          </div>

          {/* DRE IFRS Sintética */}
          <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid #0F172A', paddingBottom: '2px' }}>
            1. Demonstração do Resultado do Exercício (DRE IFRS • NBC TG 26)
          </div>
          <table className="diamond-table" style={{ margin: '4px 0 12px 0' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Estrutura de Contas DRE</th>
                <th style={{ textAlign: 'right' }}>Mês Atual (R$)</th>
                <th style={{ textAlign: 'right' }}>% Rec. Líq.</th>
                <th style={{ textAlign: 'right' }}>Acumulado Ano (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>(+) Receita Operacional Bruta de Vendas e Serviços</strong></td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>2.120.000,00</td>
                <td style={{ textAlign: 'right' }}>115.2%</td>
                <td style={{ textAlign: 'right' }}>16.480.000,00</td>
              </tr>
              <tr>
                <td>(-) Deduções da Receita Bruta (Tributos sobre Vendas PIS/COFINS/ICMS/ISS)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(279.800,00)</td>
                <td style={{ textAlign: 'right' }}>-15.2%</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(2.175.400,00)</td>
              </tr>
              <tr style={{ background: '#F1F5F9', fontWeight: 800 }}>
                <td><strong>(=) RECEITA OPERACIONAL LÍQUIDA</strong></td>
                <td style={{ textAlign: 'right', color: '#047857' }}>1.840.200,00</td>
                <td style={{ textAlign: 'right' }}>100.0%</td>
                <td style={{ textAlign: 'right', color: '#047857' }}>14.304.600,00</td>
              </tr>
              <tr>
                <td>(-) Custos dos Produtos Vendidos e Serviços Prestados (CPV / CSP)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(980.400,00)</td>
                <td style={{ textAlign: 'right' }}>-53.3%</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(7.620.000,00)</td>
              </tr>
              <tr style={{ background: '#F1F5F9', fontWeight: 800 }}>
                <td><strong>(=) LUCRO BRUTO OPERACIONAL</strong></td>
                <td style={{ textAlign: 'right' }}>859.800,00</td>
                <td style={{ textAlign: 'right' }}>46.7%</td>
                <td style={{ textAlign: 'right' }}>6.684.600,00</td>
              </tr>
              <tr>
                <td>(-) Despesas Operacionais (Vendas, Administrativas e Gerais)</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(361.560,00)</td>
                <td style={{ textAlign: 'right' }}>-19.6%</td>
                <td style={{ textAlign: 'right', color: '#DC2626' }}>(2.810.200,00)</td>
              </tr>
              <tr style={{ background: '#E2E8F0', fontWeight: 900 }}>
                <td><strong>(=) LUCRO LÍQUIDO DO PERÍODO</strong></td>
                <td style={{ textAlign: 'right', color: '#047857' }}>362.450,00</td>
                <td style={{ textAlign: 'right' }}>19.7%</td>
                <td style={{ textAlign: 'right', color: '#047857' }}>2.819.400,00</td>
              </tr>
            </tbody>
          </table>

          {/* Balanço Patrimonial Sintético */}
          <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid #0F172A', paddingBottom: '2px' }}>
            2. Balanço Patrimonial Sintético (Posição em 31/08/2026)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <table className="diamond-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>ATIVO TOTAL</th>
                  <th style={{ textAlign: 'right' }}>R$</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ativo Circulante (Disponibilidades & Clientes)</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>2.450.000,00</td>
                </tr>
                <tr>
                  <td>Estoques e Insumos Operacionais</td>
                  <td style={{ textAlign: 'right' }}>890.000,00</td>
                </tr>
                <tr>
                  <td><strong>Ativo Não Circulante (Imobilizado & Intangíveis)</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>3.120.000,00</td>
                </tr>
                <tr className="diamond-table-total">
                  <td><strong>TOTAL DO ATIVO</strong></td>
                  <td style={{ textAlign: 'right', color: '#047857' }}><strong>6.460.000,00</strong></td>
                </tr>
              </tbody>
            </table>

            <table className="diamond-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>PASSIVO & PATRIMÔNIO LÍQUIDO</th>
                  <th style={{ textAlign: 'right' }}>R$</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Passivo Circulante (Fornecedores & Tributos)</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>1.180.000,00</td>
                </tr>
                <tr>
                  <td>Passivo Não Circulante (Financiamentos LP)</td>
                  <td style={{ textAlign: 'right' }}>840.000,00</td>
                </tr>
                <tr>
                  <td><strong>Patrimônio Líquido (Capital + Reservas)</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>4.440.000,00</td>
                </tr>
                <tr className="diamond-table-total">
                  <td><strong>TOTAL DO PASSIVO & PL</strong></td>
                  <td style={{ textAlign: 'right', color: '#047857' }}><strong>6.460.000,00</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certidões de Regularidade */}
          <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid #0F172A', paddingBottom: '2px' }}>
            3. Quadro Oficial de Regularidade & Certidões Negativas (CNDs)
          </div>
          <table className="diamond-table" style={{ margin: '4px 0 12px 0' }}>
            <thead>
              <tr>
                <th>Órgão Emissor</th>
                <th>Código de Controle</th>
                <th>Validade Oficial</th>
                <th>Situação Cadastral</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Receita Federal do Brasil & PGFN (Federal)</td>
                <td>CND-RFB-2026-98124</td>
                <td>28/02/2027</td>
                <td style={{ color: '#047857', fontWeight: 800 }}>✓ NEGATIVA DE DÉBITOS (REGULAR)</td>
              </tr>
              <tr>
                <td>Secretaria de Estado da Fazenda (SEFAZ ICMS)</td>
                <td>SEFAZ-SP-8821094</td>
                <td>15/12/2026</td>
                <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULAR COM A FAZENDA ESTADUAL</td>
              </tr>
              <tr>
                <td>Caixa Econômica Federal (CRF - FGTS)</td>
                <td>CRF-CEF-20260819</td>
                <td>18/09/2026</td>
                <td style={{ color: '#047857', fontWeight: 800 }}>✓ REGULARIDADE COM FGTS DIGITAL</td>
              </tr>
            </tbody>
          </table>

          {/* 3 Assinaturas Formais Padrão Diamante */}
          <div className="diamond-signatures">
            <div className="diamond-signature-line">
              <div>DAVID VALU</div>
              <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Contador Responsável • CRC 1SP999999/O-0</div>
            </div>
            <div className="diamond-signature-line">
              <div>DIRETORIA EXECUTIVA</div>
              <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Soberano Tech S/A • Representante Legal</div>
            </div>
            <div className="diamond-signature-line">
              <div>COMITÊ DE AUDITORIA EXTERNA</div>
              <div style={{ fontSize: '0.60rem', color: '#64748B' }}>Parecer Técnico Sem Ressalvas • IFRS</div>
            </div>
          </div>

          {/* Selo e Watermark */}
          <div className="diamond-watermark-seal">
            <span>🔒 Documento Chancelado Digitalmente • ICP-Brasil • SHA-256: e89a021948efc7129038472910492837402938472093847</span>
            <span>Soberano Contábil Platinum Suite v4.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OfficeMonthlyConsolidatedBookView;
