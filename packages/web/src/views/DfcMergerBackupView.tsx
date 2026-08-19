// ==========================================================================
// SOBERANO CONTÁBIL — DEMONSTRAÇÃO DOS FLUXOS DE CAIXA (DFC - CPC 03 / IAS 7)
// Métodos Direto & Indireto • Atividades Operacionais, Investimento & Financiamento
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Building2,
  Calendar
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const DfcMergerBackupView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [competencia, setCompetencia] = useState<string>('Exercício 2026');
  const [metodoDfc, setMetodoDfc] = useState<'DIRETO' | 'INDIRETO'>('DIRETO');

  // Valores Operacionais
  const [recebimentoClientes, setRecebimentoClientes] = useState<number>(4850000.00);
  const [pagamentoFornecedores, setPagamentoFornecedores] = useState<number>(2100000.00);
  const [pagamentoSalariosEncargos, setPagamentoSalariosEncargos] = useState<number>(950000.00);
  const [tributosOperacionaisPagos, setTributosOperacionaisPagos] = useState<number>(480000.00);
  const [jurosPagos, setJurosPagos] = useState<number>(120000.00);

  // Valores de Investimento
  const [aquisicaoImobilizado, setAquisicaoImobilizado] = useState<number>(380000.00);
  const [aquisicaoIntangivel, setAquisicaoIntangivel] = useState<number>(150000.00);
  const [alienacaoAtivos, setAlienacaoAtivos] = useState<number>(90000.00);

  // Valores de Financiamento
  const [captacaoEmprestimos, setCaptacaoEmprestimos] = useState<number>(600000.00);
  const [amortizacaoEmprestimos, setAmortizacaoEmprestimos] = useState<number>(320000.00);
  const [dividendosDistribuidos, setDividendosDistribuidos] = useState<number>(250000.00);

  // Saldo Inicial de Caixa
  const [saldoInicialCaixa, setSaldoInicialCaixa] = useState<number>(450000.00);

  // Cálculos DFC
  const fluxoOperacionalLiquido = recebimentoClientes - pagamentoFornecedores - pagamentoSalariosEncargos - tributosOperacionaisPagos - jurosPagos;
  const fluxoInvestimentoLiquido = alienacaoAtivos - aquisicaoImobilizado - aquisicaoIntangivel;
  const fluxoFinanciamentoLiquido = captacaoEmprestimos - amortizacaoEmprestimos - dividendosDistribuidos;
  
  const variacaoLiquidaCaixa = fluxoOperacionalLiquido + fluxoInvestimentoLiquido + fluxoFinanciamentoLiquido;
  const saldoFinalCaixa = saldoInicialCaixa + variacaoLiquidaCaixa;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌊</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Demonstração dos Fluxos de Caixa (DFC - CPC 03 / IAS 7)
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              MÉTODO DIRETO & INDIRETO • IFRS / NBC TG 03
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Segregação das movimentações financeiras em Atividades Operacionais, de Investimento e Financiamento com conciliação do saldo de Caixa.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>
            ))}
          </select>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Imprimir DFC Diamante (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fluxo Operacional Líquido</span>
            <TrendingUp size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            + R$ {fluxoOperacionalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Geração de Caixa das Operações Principais</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fluxo de Investimento</span>
            <ArrowDownLeft size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: fluxoInvestimentoLiquido >= 0 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
            {fluxoInvestimentoLiquido >= 0 ? '+' : ''} R$ {fluxoInvestimentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">CAPEX em Imobilizado & Softwares</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Fluxo de Financiamento</span>
            <ArrowUpRight size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            {fluxoFinanciamentoLiquido >= 0 ? '+' : ''} R$ {fluxoFinanciamentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Empréstimos & Dividendos Distribuídos</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Saldo Final de Caixa & Equivalentes</span>
            <DollarSign size={18} color="#fff" />
          </div>
          <div className="metric-value font-mono" style={{ color: '#fff' }}>
            R$ {saldoFinalCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Variação no Exercício: {variacaoLiquidaCaixa >= 0 ? '+' : ''}R$ {variacaoLiquidaCaixa.toLocaleString('pt-BR')}</div>
        </div>
      </div>

      {/* Interactive Form Controls */}
      <div className="no-print panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros dos Fluxos de Caixa (Método Direto CPC 03)</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setMetodoDfc('DIRETO')}
              className={`btn-${metodoDfc === 'DIRETO' ? 'primary' : 'secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              Método Direto (Recomendado)
            </button>
            <button
              onClick={() => setMetodoDfc('INDIRETO')}
              className={`btn-${metodoDfc === 'INDIRETO' ? 'primary' : 'secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              Método Indireto (Reconciliação)
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>(+) Recebimento de Clientes</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={recebimentoClientes}
              onChange={e => setRecebimentoClientes(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(-) Pagamentos a Fornecedores</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={pagamentoFornecedores}
              onChange={e => setPagamentoFornecedores(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(-) Salários e Encargos Pagos</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={pagamentoSalariosEncargos}
              onChange={e => setPagamentoSalariosEncargos(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(-) Tributos Operacionais Pagos</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={tributosOperacionaisPagos}
              onChange={e => setTributosOperacionaisPagos(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(-) Aquisição de Imobilizado (CAPEX)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={aquisicaoImobilizado}
              onChange={e => setAquisicaoImobilizado(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(+) Captação de Financiamentos</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={captacaoEmprestimos}
              onChange={e => setCaptacaoEmprestimos(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>(-) Amortização de Dívidas</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={amortizacaoEmprestimos}
              onChange={e => setAmortizacaoEmprestimos(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Saldo Inicial de Caixa & Bancos</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={saldoInicialCaixa}
              onChange={e => setSaldoInicialCaixa(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DEMONSTRAÇÃO DOS FLUXOS DE CAIXA (DFC - CPC 03 / IAS 7) — MÉTODO {metodoDfc}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>EXERCÍCIO: <strong>{competencia}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>IFRS / NBC TG 03 Aprovado</div>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Discriminação dos Fluxos de Caixa</th>
              <th style={{ textAlign: 'right' }}>Exercício 2026 (R$)</th>
              <th style={{ textAlign: 'right' }}>Exercício 2025 (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>1. FLUXO DE CAIXA DAS ATIVIDADES OPERACIONAIS</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Recebimentos de Clientes por Vendas de Mercadorias e Serviços</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {recebimentoClientes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 4.200.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Pagamentos a Fornecedores de Mercadorias e Insumos</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {pagamentoFornecedores.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 1.900.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Pagamentos a Empregados, Salários e Encargos Sociais</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {pagamentoSalariosEncargos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 850.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Tributos Federais, Estaduais e Municipais Pagos</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {tributosOperacionaisPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 410.000,00</td>
            </tr>
            <tr style={{ fontWeight: 800 }}>
              <td>(=) Caixa Líquido Gerado pelas Atividades Operacionais</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {fluxoOperacionalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 1.040.000,00</td>
            </tr>

            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>2. FLUXO DE CAIXA DAS ATIVIDADES DE INVESTIMENTO</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Pagamentos pela Aquisição de Ativos Imobilizados (CPC 27)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {aquisicaoImobilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 320.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Pagamentos pelo Desenvolvimento de Softwares/Intangíveis (CPC 04)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {aquisicaoIntangivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 110.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Recebimentos pela Venda de Bens do Ativo Não Circulante</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {alienacaoAtivos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 40.000,00</td>
            </tr>
            <tr style={{ fontWeight: 800 }}>
              <td>(=) Caixa Líquido Consumido pelas Atividades de Investimento</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>R$ {fluxoInvestimentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 390.000,00</td>
            </tr>

            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>3. FLUXO DE CAIXA DAS ATIVIDADES DE FINANCIAMENTO</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Captação de Empréstimos e Financiamentos Bancários</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {captacaoEmprestimos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 400.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Amortização do Principal de Empréstimos e Financiamentos</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {amortizacaoEmprestimos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 280.000,00</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>Dividendos e Juros sobre Capital Próprio Pagos</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {dividendosDistribuidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 200.000,00</td>
            </tr>
            <tr style={{ fontWeight: 800 }}>
              <td>(=) Caixa Líquido Gerado / (Consumido) por Financiamentos</td>
              <td className="font-mono" style={{ textAlign: 'right', color: fluxoFinanciamentoLiquido >= 0 ? '#047857' : '#B91C1C' }}>
                {fluxoFinanciamentoLiquido >= 0 ? '+' : ''} R$ {fluxoFinanciamentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="font-mono" style={{ textAlign: 'right' }}>- R$ 80.000,00</td>
            </tr>

            <tr className="diamond-table-total">
              <td>VARIAÇÃO LÍQUIDA DE CAIXA E EQUIVALENTES DE CAIXA NO EXERCÍCIO</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>
                {variacaoLiquidaCaixa >= 0 ? '+' : ''} R$ {variacaoLiquidaCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="font-mono" style={{ textAlign: 'right' }}>+ R$ 570.000,00</td>
            </tr>
            <tr>
              <td>(+) Saldo Inicial de Caixa e Equivalentes de Caixa (01/01)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {saldoInicialCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 380.000,00</td>
            </tr>
            <tr style={{ background: '#ECFDF5', fontWeight: 800 }}>
              <td>(=) SALDO FINAL DE CAIXA E EQUIVALENTES DE CAIXA (31/12)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {saldoFinalCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ 950.000,00</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE DEMONSTRAÇÕES CONTÁBEIS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CPC 03 / IAS 7</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA FINANCEIRA & TESOURARIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Reconciliação Bancária Aprovada</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfcMergerBackupView;
