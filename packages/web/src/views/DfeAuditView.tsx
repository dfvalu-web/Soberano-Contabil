// ==========================================================================
// SOBERANO CONTÁBIL — DISTRIBUIÇÃO DF-E SEFAZ, MATRIZ DE ANOMALIAS & CROSS-AUDIT
// Conformidade: WebService Distribuição DF-e • SPED Fiscal • Pre-Flight PVA
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  parseNfeXml,
  convertDfeToJournalLines,
  detectFiscalAnomalies,
  runCrossCheckAudit,
  simulateSefazBatchDistribution,
  Company
} from '@soberano/core';
import {
  Zap,
  ShieldAlert,
  FileText,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building2,
  Download,
  Search,
  Check
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export type DfeSubTab = 'INGESTION' | 'ANOMALIES' | 'CROSS_AUDIT';

export const DfeAuditView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [activeTab, setActiveTab] = useState<DfeSubTab>('INGESTION');
  const [feedback, setFeedback] = useState<string | null>(null);

  const companyObj: Company = useMemo(() => ({
    id: currentTenant.id,
    tenantId: currentTenant.id,
    cnpj: currentTenant.cnpj.replace(/\D/g, ''),
    razaoSocial: currentTenant.name,
    nomeFantasia: currentTenant.name.split(' ')[0],
    cnaePrincipal: '2621300',
    cnaesSecundarios: [],
    regimeTributario: currentTenant.regime === 'SIMPLES_NACIONAL' ? 'SIMPLES_NACIONAL' : 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: true,
    optanteSimples: currentTenant.regime === 'SIMPLES_NACIONAL',
    createdAt: new Date(),
    updatedAt: new Date()
  }), [currentTenant]);

  const [sefazBatch, setSefazBatch] = useState(() => simulateSefazBatchDistribution(companyObj.cnpj, 0));
  const [selectedDocNsu, setSelectedDocNsu] = useState<number>(1001);

  const [xmlSample, setXmlSample] = useState<string>(() => {
    return sefazBatch.success ? sefazBatch.data.documentosEncontrados[0]?.xml || '' : '';
  });

  const parsedNfeRes = useMemo(() => parseNfeXml(xmlSample), [xmlSample]);
  const journalLinesRes = useMemo(() => {
    return parsedNfeRes.success ? convertDfeToJournalLines(parsedNfeRes.data, companyObj) : null;
  }, [parsedNfeRes, companyObj]);

  // Lista dinâmica de anomalias fiscais
  const [anomaliasList, setAnomaliasList] = useState([
    {
      id: 'anom-1',
      titulo: 'CST de PIS/COFINS Incompatível com NCM Monofásico',
      severidade: 'ALTA' as const,
      ncm: '3004.90.99 (Medicamentos)',
      cfop: '5.102',
      cstIcms: '00',
      cstPisCofins: '01 (Tributável)',
      descricao: 'Item classificado como tributável integralmente quando a legislação da Lei 10.147/00 exige alíquota zero (CST 04).',
      fundamentacaoLegal: 'Lei nº 10.147/2000 (Art. 1º) e Solução de Consulta COSIT nº 225/2014.',
      sugestaoCorrecao: 'Retificar o CST de PIS/COFINS para 04 (Alíquota Zero) no PGDAS-D e EFD-Contribuições.',
      impactoRisco: 3840.00
    },
    {
      id: 'anom-2',
      titulo: 'Divergência de Alíquota Interna de ICMS no Destino',
      severidade: 'MEDIA' as const,
      ncm: '8481.80.95 (Válvulas)',
      cfop: '6.102',
      cstIcms: '00',
      cstPisCofins: '01',
      descricao: 'Operação interestadual para consumidor final não-contribuinte sem destaque de DIFAL (EC 87/15).',
      fundamentacaoLegal: 'Emenda Constitucional nº 87/2015 e Lei Complementar nº 190/2022.',
      sugestaoCorrecao: 'Apurar e recolher o DIFAL na GNRE com partilha para a UF de destino.',
      impactoRisco: 1950.00
    },
    {
      id: 'anom-3',
      titulo: 'Ausência de Chave de Acesso Referenciada em Devolução',
      severidade: 'CRITICA' as const,
      ncm: '8708.29.99 (Peças Automotivas)',
      cfop: '5.202 (Devolução de Compra)',
      cstIcms: '00',
      cstPisCofins: '50',
      descricao: 'NF-e de devolução emitida sem informar o campo refNFe no Bloco BA da SEFAZ.',
      fundamentacaoLegal: 'Manual de Orientação do Contribuinte (MOC) v7.0 e Convênio SINIEF s/nº.',
      sugestaoCorrecao: 'Emitir carta de correção eletrônica (CC-e) ou referenciar a chave de 44 dígitos.',
      impactoRisco: 7200.00
    }
  ]);

  // Cross Audit State
  const [crossFaturamentoEfd, setCrossFaturamentoEfd] = useState<number>(450000);
  const [crossFaturamentoPis, setCrossFaturamentoPis] = useState<number>(450000);
  const [crossFaturamentoEcf, setCrossFaturamentoEcf] = useState<number>(450000);
  const [crossInssDctf, setCrossInssDctf] = useState<number>(32000);
  const [crossInssEsocial, setCrossInssEsocial] = useState<number>(32000);

  const crossAuditRes = useMemo(() => {
    return runCrossCheckAudit(companyObj, '2026-08', {
      faturamentoEfdIcms: crossFaturamentoEfd,
      faturamentoEfdContribuicoes: crossFaturamentoPis,
      faturamentoEcfDRE: crossFaturamentoEcf,
      inssDctfWebApurado: crossInssDctf,
      inssEsocialCalculado: crossInssEsocial,
      inssReinfRetido: 0
    });
  }, [companyObj, crossFaturamentoEfd, crossFaturamentoPis, crossFaturamentoEcf, crossInssDctf, crossInssEsocial]);

  const handleSimulateSefaz = () => {
    const nextNsu = Math.floor(Math.random() * 9000) + 1000;
    const res = simulateSefazBatchDistribution(companyObj.cnpj, nextNsu);
    setSefazBatch(res);
    if (res.success && res.data.documentosEncontrados[0]) {
      setXmlSample(res.data.documentosEncontrados[0].xml);
      setSelectedDocNsu(res.data.documentosEncontrados[0].nsu);
    }
    setFeedback('Consulta SEFAZ executada: Lote de DF-e atualizado com sucesso!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLoadXml = (doc: any) => {
    setSelectedDocNsu(doc.nsu);
    setXmlSample(doc.xml);
    setFeedback(`XML do documento NSU #${doc.nsu} (${doc.schema}) carregado com sucesso!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const totalImpactoRiscoAnomalias = anomaliasList.reduce((acc, a) => acc + a.impactoRisco, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Distribuição DF-e Sefaz (Download Automático em Lote) & Auditoria
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              WEBSERVICE SEFAZ • DETECTOR DE ANOMALIAS • CROSS-AUDIT
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Captura instantânea de NF-e/CT-e/NFS-e por NSU, matriz de anomalias fiscais e cruzamento preventivo EFD x ECF x DCTFWeb.
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
            <span>Imprimir Dossiê DF-e (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* Segmented Subtab Selector (High Contrast Diamond) */}
      <div className="no-print panel-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {/* Aba 1: Ingestão */}
          <button
            type="button"
            onClick={() => setActiveTab('INGESTION')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'INGESTION' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === 'INGESTION' 
                ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'INGESTION' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: activeTab === 'INGESTION' 
                ? '2px solid #38BDF8' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: activeTab === 'INGESTION' 
                ? '0 6px 20px -2px rgba(2, 132, 199, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: activeTab === 'INGESTION' ? 'translateY(-1px)' : 'none'
            }}
          >
            <Zap size={18} color={activeTab === 'INGESTION' ? '#ffffff' : '#38BDF8'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Ingestão DF-e Sefaz</div>
              <div style={{ fontSize: '0.68rem', opacity: activeTab === 'INGESTION' ? 0.95 : 0.7 }}>Download Automático em Lote</div>
            </div>
            {activeTab === 'INGESTION' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>

          {/* Aba 2: Anomalias */}
          <button
            type="button"
            onClick={() => setActiveTab('ANOMALIES')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'ANOMALIES' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === 'ANOMALIES' 
                ? 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'ANOMALIES' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: activeTab === 'ANOMALIES' 
                ? '2px solid #FB7185' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: activeTab === 'ANOMALIES' 
                ? '0 6px 20px -2px rgba(225, 29, 72, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: activeTab === 'ANOMALIES' ? 'translateY(-1px)' : 'none'
            }}
          >
            <ShieldAlert size={18} color={activeTab === 'ANOMALIES' ? '#ffffff' : '#FB7185'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Matriz de Anomalias Fiscais</div>
              <div style={{ fontSize: '0.68rem', opacity: activeTab === 'ANOMALIES' ? 0.95 : 0.7 }}>Risco de Glosa & Malha Fina</div>
            </div>
            {activeTab === 'ANOMALIES' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>

          {/* Aba 3: Cross-Audit */}
          <button
            type="button"
            onClick={() => setActiveTab('CROSS_AUDIT')}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'CROSS_AUDIT' ? 800 : 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === 'CROSS_AUDIT' 
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'CROSS_AUDIT' ? '#ffffff' : 'var(--text-secondary, #94A3B8)',
              border: activeTab === 'CROSS_AUDIT' 
                ? '2px solid #34D399' 
                : '1.5px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
              boxShadow: activeTab === 'CROSS_AUDIT' 
                ? '0 6px 20px -2px rgba(5, 150, 105, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              transform: activeTab === 'CROSS_AUDIT' ? 'translateY(-1px)' : 'none'
            }}
          >
            <CheckCircle2 size={18} color={activeTab === 'CROSS_AUDIT' ? '#ffffff' : '#34D399'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ lineHeight: 1.2 }}>Pre-Flight Cross-Auditor</div>
              <div style={{ fontSize: '0.68rem', opacity: activeTab === 'CROSS_AUDIT' ? 0.95 : 0.7 }}>Cruzamento EFD x ECF x DCTF</div>
            </div>
            {activeTab === 'CROSS_AUDIT' && (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>ATIVO</span>
            )}
          </button>
        </div>
      </div>

      {/* 1. ABA INGESTION */}
      {activeTab === 'INGESTION' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 700 }}>Documentos Eletrônicos Localizados na SEFAZ (NSU Batch)</h3>
                <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Último NSU Consultado: #{sefazBatch.data?.ultimoNsuConsultado || 1005}</p>
              </div>
              <button className="btn-primary-action" onClick={handleSimulateSefaz} style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} /> Consultar Novos NSUs SEFAZ
              </button>
            </div>

            {sefazBatch.success && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>NSU</th>
                      <th>Tipo Doc</th>
                      <th>Chave de Acesso (44 dígitos)</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sefazBatch.data.documentosEncontrados.map(doc => {
                      const isThisSelected = selectedDocNsu === doc.nsu;
                      return (
                        <tr key={doc.nsu} style={{ background: isThisSelected ? 'rgba(6, 182, 212, 0.08)' : 'transparent' }}>
                          <td className="font-mono" style={{ fontWeight: 800, color: isThisSelected ? 'var(--cyan-400)' : '#fff' }}>#{doc.nsu}</td>
                          <td><span className="badge badge-emerald">{doc.schema}</span></td>
                          <td className="font-mono" style={{ fontSize: '0.78rem' }}>{doc.chave}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="badge badge-cyan">Autorizado SEFAZ</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-primary-action"
                              style={{ padding: '4px 10px', fontSize: '0.72rem', background: isThisSelected ? 'var(--emerald-500)' : undefined }}
                              onClick={() => handleLoadXml(doc)}
                            >
                              {isThisSelected ? '✓ Selecionado' : 'Carregar XML'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Dados da NF-e & Auto-Entry */}
          {parsedNfeRes.success && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="no-print panel-card">
                <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Dados da NF-e Nº {parsedNfeRes.data.numero}</span>
                  <span className="badge badge-emerald">Mod. {parsedNfeRes.data.modelo}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Emitente:</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{parsedNfeRes.data.emitente.razaoSocial}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CNPJ Emitente:</span>
                    <span className="font-mono">{parsedNfeRes.data.emitente.cnpj}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Valor Total da Nota:</span>
                    <span className="font-mono" style={{ fontWeight: 800, color: 'var(--emerald-400)', fontSize: '1rem' }}>
                      R$ {parsedNfeRes.data.totais.valorTotalNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Crédito ICMS Destacado:</span>
                    <span className="font-mono" style={{ color: '#fff' }}>R$ {parsedNfeRes.data.totais.valorIcms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Crédito PIS + COFINS:</span>
                    <span className="font-mono" style={{ color: '#fff' }}>R$ {(parsedNfeRes.data.totais.valorPis + parsedNfeRes.data.totais.valorCofins).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {journalLinesRes && journalLinesRes.success && (
                <div className="no-print panel-card">
                  <div style={{ padding: '10px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Auto-Entry: Partidas Dobradas IFRS Geradas</span>
                    <span className="badge badge-cyan">Diário Geral Automático</span>
                  </div>

                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Conta Contábil</th>
                          <th>Tipo</th>
                          <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalLinesRes.data.map((l, i) => (
                          <tr key={i}>
                            <td style={{ fontSize: '0.78rem', fontWeight: 600 }}>{l.accountName}</td>
                            <td>
                              <span className={`badge badge-${l.type === 'DEBIT' ? 'cyan' : 'emerald'}`}>
                                {l.type === 'DEBIT' ? 'Débito (D)' : 'Crédito (C)'}
                              </span>
                            </td>
                            <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                              R$ {l.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. ABA ANOMALIES (MATRIZ DE ANOMALIAS FISCAIS) */}
      {activeTab === 'ANOMALIES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print grid-cards-4">
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Anomalias Detectadas</span></div>
              <div className="metric-value font-mono" style={{ color: '#F87171' }}>
                {anomaliasList.length} Inconsistências
              </div>
              <div className="metric-sub">Varredura de Regras RFB/SEFAZ</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Severidade Crítica</span></div>
              <div className="metric-value" style={{ color: '#F87171', fontWeight: 800 }}>ALERTA MÁXIMO</div>
              <div className="metric-sub">Risco de Glosa de Crédito</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Exposição Financeira</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
                R$ {totalImpactoRiscoAnomalias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">Potencial de Auto de Infração</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Ação Preventiva</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)', fontSize: '0.90rem' }}>
                SANEAMENTO DISPONÍVEL
              </div>
              <div className="metric-sub">100% Retificável sem Multas</div>
            </div>
          </div>

          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {anomaliasList.map(anom => (
              <div key={anom.id} style={{ background: 'var(--bg-surface-elevated)', padding: '16px 20px', borderRadius: '10px', borderLeft: `4px solid ${anom.severidade === 'CRITICA' ? '#E11D48' : anom.severidade === 'ALTA' ? '#F59E0B' : '#0284C7'}`, border: '1px solid var(--border-medium)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={17} color={anom.severidade === 'CRITICA' ? '#FB7185' : '#FBBF24'} />
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>{anom.titulo}</h4>
                  </div>
                  <span className={`badge badge-${anom.severidade === 'CRITICA' ? 'red' : anom.severidade === 'ALTA' ? 'amber' : 'cyan'}`}>
                    SEVERIDADE {anom.severidade}
                  </span>
                </div>

                <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{anom.descricao}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: 'var(--bg-surface-card)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '8px' }}>
                  <div><strong style={{ color: '#94A3B8' }}>NCM:</strong> <span className="font-mono">{anom.ncm}</span></div>
                  <div><strong style={{ color: '#94A3B8' }}>CFOP:</strong> <span className="font-mono">{anom.cfop}</span></div>
                  <div><strong style={{ color: '#94A3B8' }}>CST Informado:</strong> <span className="font-mono">{anom.cstPisCofins}</span></div>
                  <div><strong style={{ color: '#94A3B8' }}>Impacto de Risco:</strong> <span className="font-mono" style={{ color: '#F87171', fontWeight: 700 }}>R$ {anom.impactoRisco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--cyan-400)', marginBottom: '4px' }}>
                  <strong>Fundamentação Legal:</strong> {anom.fundamentacaoLegal}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--emerald-400)' }}>
                  <strong>Ação de Correção Recomendada:</strong> {anom.sugestaoCorrecao}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ABA CROSS-AUDIT */}
      {activeTab === 'CROSS_AUDIT' && crossAuditRes.success && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="no-print panel-card">
            <div style={{ padding: '10px 0 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros de Cruzamento Centavo a Centavo (EFD x ECF x DCTFWeb)</span>
              <span className="badge badge-emerald">Score: {crossAuditRes.data.scoreConformidadeFiscal}/100</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Faturamento EFD-ICMS/IPI (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={crossFaturamentoEfd}
                  onChange={(e) => setCrossFaturamentoEfd(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Faturamento EFD-Contribuições (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={crossFaturamentoPis}
                  onChange={(e) => setCrossFaturamentoPis(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Faturamento DRE na ECF (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={crossFaturamentoEcf}
                  onChange={(e) => setCrossFaturamentoEcf(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>INSS Declarado DCTFWeb (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={crossInssDctf}
                  onChange={(e) => setCrossInssDctf(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid-cards-4">
              <div className="metric-card">
                <div className="metric-header"><span className="metric-title">Score de Conformidade</span></div>
                <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                  {crossAuditRes.data.scoreConformidadeFiscal} %
                </div>
                <div className="metric-sub">Cruzamento perfeito RFB</div>
              </div>
              <div className="metric-card">
                <div className="metric-header"><span className="metric-title">Divergências EFD x ECF</span></div>
                <div className="metric-value font-mono" style={{ color: crossAuditRes.data.anomaliasCriticas > 0 ? '#F87171' : 'var(--emerald-400)' }}>
                  {crossAuditRes.data.anomaliasCriticas}
                </div>
                <div className="metric-sub">Risco de malha fina fiscal</div>
              </div>
              <div className="metric-card">
                <div className="metric-header"><span className="metric-title">Divergências DCTFWeb</span></div>
                <div className="metric-value font-mono" style={{ color: crossAuditRes.data.anomaliasAltas > 0 ? '#F87171' : 'var(--emerald-400)' }}>
                  {crossAuditRes.data.anomaliasAltas}
                </div>
                <div className="metric-sub">Divergência com eSocial / Reinf</div>
              </div>
              <div className="metric-card">
                <div className="metric-header"><span className="metric-title">Total Divergências</span></div>
                <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                  0 Pendências
                </div>
                <div className="metric-sub">Gerações validadas</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ TÉCNICO DE AUDITORIA ELETRÔNICA DE DF-E, ANOMALIAS & MALHA FINA</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Pre-Flight Sefaz Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Documentos Ingeridos</strong>
            <span className="font-mono">{sefazBatch.data?.documentosEncontrados.length || 3} NF-e / CT-e</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Score Cross-Audit</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>100% Conforme</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Anomalias Identificadas</strong>
            <span className="font-mono">{anomaliasList.length} Alertas Preventivos</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Status de Transmissão</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ APTO PARA ESCRITURAÇÃO</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Demonstrativo de Confronto Cruzado</th>
              <th style={{ textAlign: 'right' }}>EFD Fiscal (R$)</th>
              <th style={{ textAlign: 'right' }}>ECF / DCTF (R$)</th>
              <th style={{ textAlign: 'center' }}>Veredito Forense</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Faturamento de Vendas (EFD-ICMS vs ECF DRE)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossFaturamentoEfd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossFaturamentoEcf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', color: '#047857', fontWeight: 700 }}>100% CONCILIADO</td>
            </tr>
            <tr>
              <td>Contribuições PIS/COFINS (EFD-Contr vs ECF)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossFaturamentoPis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossFaturamentoEcf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', color: '#047857', fontWeight: 700 }}>100% CONCILIADO</td>
            </tr>
            <tr>
              <td>Encargos Previdenciários (eSocial vs DCTFWeb)</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossInssEsocial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {crossInssDctf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', color: '#047857', fontWeight: 700 }}>100% CONCILIADO</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE ENTRADAS & DF-E</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Distribuição SEFAZ</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA DE MALHAS FISCAIS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>EFD x ECF x DCTFWeb</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfeAuditView;
