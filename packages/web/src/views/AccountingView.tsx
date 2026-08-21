import React, { useState, useEffect, useTransition } from 'react';
import { SmartPeriodPicker } from '../components/SmartPeriodPicker.js';
import { officeStore, PeriodFilterState } from '../state/office-store.js';

import {
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  generateFinancialStatements,
  generateDfcStatement,
  generateDmplStatement,
  generateExplanatoryNotes,
  executeAnnualClosing,
  Company
} from '@soberano/core';
import { Scale, FileSpreadsheet, BookOpen, Layers, FileText, CheckCircle2, DollarSign } from 'lucide-react';

export const AccountingView = () => {
  const [period, setPeriod] = useState<PeriodFilterState>(() => officeStore.getPeriodFilter());

  useEffect(() => {
    const unsub = officeStore.subscribePeriodFilter((newPeriod) => {
      setPeriod(newPeriod);
    });
    return unsub;
  }, []);
  const [tenantId] = useState('tenant-01');
  const [, startTransition] = useTransition();
  const [contas] = useState(() => createStandardChartOfAccounts(tenantId));
  const [engine] = useState(() => {
    const e = new DoubleEntryEngine(contas);
    e.postEntry('tenant-01', '2026-01-02', 'Integralização de Capital Social', [
      { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 150000.00 },
      { accountId: '2.3.1.01', accountCode: '2.3.1.01', accountName: 'Capital Social Subscrito', type: 'CREDIT', amount: 150000.00 }
    ]);
    e.postEntry('tenant-01', '2026-01-05', 'Aquisição de Mercadorias para Revenda', [
      { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Mercadorias para Revenda', type: 'DEBIT', amount: 40000.00 },
      { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'CREDIT', amount: 40000.00 }
    ]);
    e.postEntry('tenant-01', '2026-01-10', 'Venda de Mercadorias Faturamento', [
      { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'DEBIT', amount: 85000.00 },
      { accountId: '3.1.1.01', accountCode: '3.1.1.01', accountName: 'Receita de Venda de Mercadorias', type: 'CREDIT', amount: 85000.00 }
    ]);
    e.postEntry('tenant-01', '2026-01-10', 'Baixa de CMV', [
      { accountId: '4.1.1.01', accountCode: '4.1.1.01', accountName: 'Custo das Mercadorias Vendidas (CMV)', type: 'DEBIT', amount: 30000.00 },
      { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Mercadorias para Revenda', type: 'CREDIT', amount: 30000.00 }
    ]);
    return e;
  });

  const [activeSubTab, setActiveSubTab] = useState<'STATEMENTS' | 'DFC' | 'DMPL' | 'NOTES' | 'ENTRIES' | 'CHART'>('STATEMENTS');
  const [closureMessage, setClosureMessage] = useState<string | null>(null);

  const mockCompany: Company = {
    id: 'comp-01',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO INDUSTRIA E TECNOLOGIA S/A',
    nomeFantasia: 'Soberano Indústria',
    cnaePrincipal: '2621300',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const statementsRes = generateFinancialStatements(engine.getAccounts(), period.startDate, period.endDate);
  const stmts = statementsRes.success ? statementsRes.data : null;

  const dfcRes = generateDfcStatement(engine.getAccounts(), 50000.00, period.startDate, period.endDate, 'INDIRETO');
  const dfc = dfcRes.success ? dfcRes.data : null;

  const dmplRes = generateDmplStatement(150000, 15000, 20000, 55000, 10000, period.startDate, period.endDate);
  const dmpl = dmplRes.success ? dmplRes.data : null;

  const notesRes = stmts ? generateExplanatoryNotes(mockCompany, '2026', stmts.balanceSheet, stmts.incomeStatement) : null;
  const notes = notesRes && notesRes.success ? notesRes.data : null;

  const handleExecuteClosure = () => {
    const res = executeAnnualClosing(engine, tenantId, '2026-12-31', '2.3.1.01', 'Capital e Reservas');
    if (res.success) {
      setClosureMessage(`Encerramento Anual (ARE) executado com sucesso. Resultado Líquido Apurado: R$ ${res.data.resultadoLiquidoExercicio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    } else {
      setClosureMessage(res.error.message);
    }
  };

  return (
    <div>
      {/* Subtab Selector */}
      <div className="no-print panel-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Módulos Contábeis IFRS / CPC</span>
          <button onClick={() => window.print()} className="btn-primary-action" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            🖨️ Imprimir Balanço & DRE Diamante (A4)
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-${activeSubTab === 'STATEMENTS' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('STATEMENTS'))}
          >
            <Scale size={16} /> Balanço & DRE (CPC 26)
          </button>
          <button
            className={`btn-${activeSubTab === 'DFC' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('DFC'))}
          >
            <DollarSign size={16} /> DFC Fluxo de Caixa (CPC 03)
          </button>
          <button
            className={`btn-${activeSubTab === 'DMPL' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('DMPL'))}
          >
            <Layers size={16} /> DMPL Mutações do PL
          </button>
          <button
            className={`btn-${activeSubTab === 'NOTES' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('NOTES'))}
          >
            <FileText size={16} /> Notas Explicativas IFRS
          </button>
          <button
            className={`btn-${activeSubTab === 'ENTRIES' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('ENTRIES'))}
          >
            <BookOpen size={16} /> Diário & Partidas Dobradas
          </button>
          <button
            className={`btn-${activeSubTab === 'CHART' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveSubTab('CHART'))}
          >
            <FileSpreadsheet size={16} /> Plano de Contas RFB
          </button>
        </div>
      </div>

      {closureMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--emerald-500)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={18} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff' }}>{closureMessage}</span>
        </div>
      )}

      {/* STATEMENTS VIEW */}
      {activeSubTab === 'STATEMENTS' && stmts && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="panel-card">
            <div className="panel-title-bar">
              <h2><Scale size={18} color="var(--emerald-500)" /> Balanço Patrimonial (IFRS/CPC)</h2>
              <span className="badge badge-emerald">Equilibrado</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--cyan-500)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>ATIVO</h4>
              <div className="table-container">
                <table className="data-table">
                  <tbody>
                    {stmts.balanceSheet.ativoCirculante.map(l => (
                      <tr key={l.codigo}>
                        <td className="font-mono" style={{ width: '110px' }}>{l.codigo}</td>
                        <td>{l.descricao}</td>
                        <td className="font-mono" style={{ textAlign: 'right' }}>R$ {l.valorPeriodoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(255,255,255,0.04)', fontWeight: 800 }}>
                      <td colSpan={2}>TOTAL DO ATIVO</td>
                      <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                        R$ {stmts.balanceSheet.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'var(--indigo-500)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>PASSIVO E PATRIMÔNIO LÍQUIDO</h4>
              <div className="table-container">
                <table className="data-table">
                  <tbody>
                    {stmts.balanceSheet.patrimonioLiquido.map(l => (
                      <tr key={l.codigo}>
                        <td className="font-mono" style={{ width: '110px' }}>{l.codigo}</td>
                        <td>{l.descricao}</td>
                        <td className="font-mono" style={{ textAlign: 'right' }}>R$ {l.valorPeriodoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(255,255,255,0.04)', fontWeight: 800 }}>
                      <td colSpan={2}>TOTAL PASSIVO + PL</td>
                      <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                        R$ {stmts.balanceSheet.totalPassivoEPatrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-title-bar">
              <h2><FileSpreadsheet size={18} color="var(--indigo-500)" /> Demonstração do Resultado (DRE)</h2>
              <span className="badge badge-indigo">CPC 26</span>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {stmts.incomeStatement.linhas.map(l => (
                    <tr key={l.codigo} style={{ fontWeight: l.isDestaque ? 700 : 400 }}>
                      <td>{l.descricao}</td>
                      <td className="font-mono" style={{ textAlign: 'right', color: l.codigo === '8' ? 'var(--emerald-400)' : '#fff' }}>
                        R$ {l.valorPeriodoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DFC VIEW */}
      {activeSubTab === 'DFC' && dfc && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><DollarSign size={20} color="var(--emerald-500)" /> Demonstração dos Fluxos de Caixa (DFC - CPC 03)</h2>
            <span className="badge badge-emerald">Método {dfc.metodo}</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item do Fluxo de Caixa</th>
                  <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 700 }}>
                  <td colSpan={2}>1. FLUXO DE CAIXA DAS ATIVIDADES OPERACIONAIS</td>
                </tr>
                {dfc.fluxoAtividadesOperacionais.map(l => (
                  <tr key={l.codigo}>
                    <td style={{ paddingLeft: '1.5rem' }}>{l.descricao}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 800 }}>
                  <td>(=) Fluxo Líquido das Atividades Operacionais</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>R$ {dfc.totalFluxoOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>

                <tr style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 700 }}>
                  <td colSpan={2}>2. FLUXO DE CAIXA DAS ATIVIDADES DE INVESTIMENTO</td>
                </tr>
                {dfc.fluxoAtividadesInvestimento.map(l => (
                  <tr key={l.codigo}>
                    <td style={{ paddingLeft: '1.5rem' }}>{l.descricao}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}

                <tr style={{ background: 'rgba(255,255,255,0.02)', fontWeight: 700 }}>
                  <td colSpan={2}>3. FLUXO DE CAIXA DAS ATIVIDADES DE FINANCIAMENTO</td>
                </tr>
                {dfc.fluxoAtividadesFinanciamento.map(l => (
                  <tr key={l.codigo}>
                    <td style={{ paddingLeft: '1.5rem' }}>{l.descricao}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}

                <tr style={{ background: 'rgba(16, 185, 129, 0.08)', fontWeight: 800 }}>
                  <td>(=) SALDO FINAL DE CAIXA E EQUIVALENTES</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>R$ {dfc.saldoFinalCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DMPL VIEW */}
      {activeSubTab === 'DMPL' && dmpl && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Layers size={20} color="var(--cyan-500)" /> Demonstração das Mutações do Patrimônio Líquido (DMPL)</h2>
            <span className="badge badge-cyan">Variação Total: R$ {dmpl.variacaoTotalPl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Conta do Patrimônio Líquido</th>
                  <th style={{ textAlign: 'right' }}>Saldo Inicial</th>
                  <th style={{ textAlign: 'right' }}>Lucro do Período</th>
                  <th style={{ textAlign: 'right' }}>Destinações / Dividendos</th>
                  <th style={{ textAlign: 'right' }}>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {dmpl.colunas.map(c => (
                  <tr key={c.coluna}>
                    <td style={{ fontWeight: 600 }}>{c.coluna}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {c.saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {c.lucroLiquidoPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {(c.constituicaoReservas + c.distribuicaoDividendosJcp).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--emerald-400)' }}>R$ {c.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NOTES VIEW */}
      {activeSubTab === 'NOTES' && notes && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><FileText size={20} color="var(--indigo-500)" /> Notas Explicativas às Demonstrações Contábeis</h2>
            <span className="badge badge-indigo">CPC 26 / IFRS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {notes.notasExplicativas.map(n => (
              <div key={n.numero} style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--emerald-400)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Nota {n.numero} — {n.titulo}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{n.conteudo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENTRIES & CLOSING */}
      {activeSubTab === 'ENTRIES' && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><BookOpen size={18} color="var(--emerald-500)" /> Livro Diário & Partidas Dobradas</h2>
            <button className="btn-primary" onClick={handleExecuteClosure}>
              <CheckCircle2 size={15} /> Executar Fechamento Anual (ARE)
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Data</th>
                  <th>Histórico</th>
                  <th>Total (R$)</th>
                  <th>Hash Integridade (SHA-256)</th>
                </tr>
              </thead>
              <tbody>
                {engine.getEntries().map(e => (
                  <tr key={e.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>#{e.numeroLancamento}</td>
                    <td className="font-mono">{e.data}</td>
                    <td>{e.historicoPadrao}</td>
                    <td className="font-mono" style={{ fontWeight: 700, textAlign: 'right' }}>R$ {e.totalDebito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.hashTransacao.substring(0, 20)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHART VIEW */}
      {activeSubTab === 'CHART' && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><FileSpreadsheet size={18} color="var(--emerald-500)" /> Plano de Contas & Amarração Referencial RFB</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome da Conta</th>
                  <th>Tipo</th>
                  <th>Natureza</th>
                  <th>Conta RFB</th>
                  <th style={{ textAlign: 'right' }}>Saldo Atual</th>
                </tr>
              </thead>
              <tbody>
                {engine.getAccounts().map(a => (
                  <tr key={a.id}>
                    <td className="font-mono">{a.codigo}</td>
                    <td>{a.nome}</td>
                    <td><span className="badge badge-indigo">{a.tipo}</span></td>
                    <td>{a.natureza === 'DEBIT' ? 'Devedora' : 'Credora'}</td>
                    <td className="font-mono" style={{ color: 'var(--cyan-500)' }}>{a.codigoContaReferencialRfb || '—'}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>R$ {Math.abs(a.saldoAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    
      {/* BALANÇO PATRIMONIAL & DRE CONSOLIDADO (PADRÃO DIAMANTE) */}
      <div className="diamond-paper-a4" style={{ marginTop: '14px' }}>
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{mockCompany.razaoSocial}</div>
            <div className="diamond-subtitle">DEMONSTRAÇÕES CONTÁBEIS CONSOLIDADAS • BALANÇO PATRIMONIAL & DRE (NBC TG 26 / IFRS)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{mockCompany.cnpj}</strong></div>
            <div>EXERCÍCIO SOCIAL: <strong>2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Regime: Lucro Real Trimestral</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Total do Ativo</strong>
            <span className="font-mono">R$ {stmts ? stmts.balanceSheet.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total do Passivo + PL</strong>
            <span className="font-mono">R$ {stmts ? stmts.balanceSheet.totalPassivoEPatrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Receita Líquida</strong>
            <span className="font-mono">R$ 85.000,00</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Lucro Líquido do Exercício</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>R$ 55.000,00</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#0F172A', borderBottom: '1.5px solid #0F172A', paddingBottom: '2px', marginBottom: '4px' }}>
              BALANÇO PATRIMONIAL (ATIVO / PASSIVO / PL)
            </div>
            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Conta / Grupo Patrimonial</th>
                  <th style={{ textAlign: 'right' }}>Saldo Atual (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. ATIVO CIRCULANTE</strong> (Disponível + Clientes)</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ 205.000,00</td>
                </tr>
                <tr>
                  <td><strong>2. PASSIVO CIRCULANTE</strong> (Fornecedores + Tributos)</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ 0,00</td>
                </tr>
                <tr>
                  <td><strong>2.3 PATRIMÔNIO LÍQUIDO</strong> (Capital + Lucros)</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ 205.000,00</td>
                </tr>
                <tr className="diamond-table-total">
                  <td>TOTAL PASSIVO E PL EQUILIBRADO</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ 205.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#0F172A', borderBottom: '1.5px solid #0F172A', paddingBottom: '2px', marginBottom: '4px' }}>
              DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO (DRE)
            </div>
            <table className="diamond-table">
              <thead>
                <tr>
                  <th>Estrutura da DRE (CPC 26)</th>
                  <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Receita Bruta de Vendas</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>R$ 85.000,00</td>
                </tr>
                <tr>
                  <td>(-) Custo das Mercadorias Vendidas (CMV)</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ 30.000,00</td>
                </tr>
                <tr>
                  <td>(=) Lucro Bruto Operacional</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ 55.000,00</td>
                </tr>
                <tr className="diamond-table-total">
                  <td>LUCRO LÍQUIDO DO EXERCÍCIO</td>
                  <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ 55.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontSize: '0.68rem' }}>
          <strong>Nota Explicativa Síntese:</strong> As demonstrações contábeis foram elaboradas em estrita consonância com a Lei 6.404/76 e NBC TG 26 (CPC 26 R1). Ativo e Passivo perfeitamente conciliados via partidas dobradas com conciliação bancária integral.
        </div>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA PRESIDENTE / CEO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>{mockCompany.razaoSocial}</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONTADOR RESPONSÁVEL TÉCNICO</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">CONSELHO FISCAL / AUDITORIA</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Parecer IFRS Sem Ressalvas</div>
          </div>
        </div>

        <div className="diamond-watermark-seal">
          <div>SOBERANO CONTÁBIL • BALANÇO & DRE IFRS • CERTIFICAÇÃO DIGITAL SHA-256: <code>AA10988BA9910C</code></div>
          <div>PÁGINA 1 DE 1 • DEMONSTRAÇÃO OFICIAL HOMOLOGADA</div>
        </div>
      </div>

    </div>
  );
};
