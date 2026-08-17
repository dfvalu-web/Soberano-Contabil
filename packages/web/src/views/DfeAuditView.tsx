import { useState, useTransition } from 'react';
import {
  parseNfeXml,
  parseCteXml,
  parseNfseXml,
  convertDfeToJournalLines,
  detectFiscalAnomalies,
  runCrossCheckAudit,
  simulateSefazBatchDistribution,
  Company
} from '@soberano/core';
import { Zap, ShieldAlert, FileText, CheckCircle2, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

export const DfeAuditView = () => {
  const [activeTab, setActiveTab] = useState<'INGESTION' | 'ANOMALIES' | 'CROSS_AUDIT'>('INGESTION');
  const [, startTransition] = useTransition();

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

  const [sefazBatch, setSefazBatch] = useState(() => simulateSefazBatchDistribution(mockCompany.cnpj, 0));

  const [xmlSample, setXmlSample] = useState(() => {
    return sefazBatch.success ? sefazBatch.data.documentosEncontrados[0]?.xml || '' : '';
  });

  const parsedNfeRes = parseNfeXml(xmlSample);
  const journalLinesRes = parsedNfeRes.success ? convertDfeToJournalLines(parsedNfeRes.data, mockCompany) : null;

  // Anomaly detector test item
  const anomalyRes = detectFiscalAnomalies([
    {
      ncm: '22021000', // Monofásico
      cfop: '5102',
      cstIcms: '00',
      cstPisCofins: '01',
      aliqIcms: 0,
      aliqPis: 1.65,
      aliqCofins: 7.60,
      valorOperacao: 800
    }
  ]);

  // Cross Audit State
  const [crossFaturamentoEfd, setCrossFaturamentoEfd] = useState<number>(300000);
  const [crossFaturamentoPis, setCrossFaturamentoPis] = useState<number>(300000);
  const [crossFaturamentoEcf, setCrossFaturamentoEcf] = useState<number>(300000);
  const [crossInssDctf, setCrossInssDctf] = useState<number>(25000);
  const [crossInssEsocial, setCrossInssEsocial] = useState<number>(25000);

  const crossAuditRes = runCrossCheckAudit(mockCompany, '2026-01', {
    faturamentoEfdIcms: crossFaturamentoEfd,
    faturamentoEfdContribuicoes: crossFaturamentoPis,
    faturamentoEcfDRE: crossFaturamentoEcf,
    inssDctfWebApurado: crossInssDctf,
    inssEsocialCalculado: crossInssEsocial,
    inssReinfRetido: 0
  });

  const handleSimulateSefaz = () => {
    const res = simulateSefazBatchDistribution(mockCompany.cnpj, Math.floor(Math.random() * 1000));
    setSefazBatch(res);
    if (res.success && res.data.documentosEncontrados[0]) {
      setXmlSample(res.data.documentosEncontrados[0].xml);
    }
  };

  return (
    <div>
      {/* Subtab Selector */}
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-${activeTab === 'INGESTION' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('INGESTION'))}
          >
            <Zap size={16} /> Ingestão DF-e Zero-Touch (Sefaz Batch)
          </button>
          <button
            className={`btn-${activeTab === 'ANOMALIES' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('ANOMALIES'))}
          >
            <ShieldAlert size={16} /> Matriz de Anomalias Fiscais & Risco de Glosa
          </button>
          <button
            className={`btn-${activeTab === 'CROSS_AUDIT' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('CROSS_AUDIT'))}
          >
            <CheckCircle2 size={16} /> Pre-Flight Cross-Auditor (EFD x ECF x DCTFWeb)
          </button>
        </div>
      </div>

      {/* INGESTION */}
      {activeTab === 'INGESTION' && (
        <div>
          <div className="panel-card">
            <div className="panel-title-bar">
              <h2><Zap size={20} color="var(--cyan-500)" /> Distribuição DF-e Sefaz (Download Automático em Lote)</h2>
              <button className="btn-primary" onClick={handleSimulateSefaz}>
                <RefreshCw size={15} /> Consultar NSU Sefaz
              </button>
            </div>

            {sefazBatch.success && (
              <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NSU</th>
                      <th>Tipo Doc</th>
                      <th>Chave de Acesso</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sefazBatch.data.documentosEncontrados.map(doc => (
                      <tr key={doc.nsu}>
                        <td className="font-mono" style={{ fontWeight: 700 }}>#{doc.nsu}</td>
                        <td><span className="badge badge-emerald">{doc.schema}</span></td>
                        <td className="font-mono" style={{ fontSize: '0.78rem' }}>{doc.chave}</td>
                        <td>
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setXmlSample(doc.xml)}
                          >
                            Carregar XML
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {parsedNfeRes.success && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="panel-card">
                <div className="panel-title-bar">
                  <h2><FileText size={18} color="var(--emerald-400)" /> Dados da Nota Fiscal Escriturada</h2>
                  <span className="badge badge-emerald">NF-e {parsedNfeRes.data.numero}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Emitente:</span>
                    <span style={{ fontWeight: 600 }}>{parsedNfeRes.data.emitente.razaoSocial}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CNPJ Emitente:</span>
                    <span className="font-mono">{parsedNfeRes.data.emitente.cnpj}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Valor Total da Nota:</span>
                    <span className="font-mono" style={{ fontWeight: 800, color: 'var(--emerald-400)' }}>
                      R$ {parsedNfeRes.data.totais.valorTotalNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Crédito ICMS Destacado:</span>
                    <span className="font-mono">R$ {parsedNfeRes.data.totais.valorIcms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Crédito PIS + COFINS:</span>
                    <span className="font-mono">R$ {(parsedNfeRes.data.totais.valorPis + parsedNfeRes.data.totais.valorCofins).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {journalLinesRes && journalLinesRes.success && (
                <div className="panel-card">
                  <div className="panel-title-bar">
                    <h2><ArrowRight size={18} color="var(--indigo-500)" /> Auto-Entry: Partidas Dobradas Geradas</h2>
                    <span className="badge badge-indigo">Classificação IFRS</span>
                  </div>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Conta</th>
                          <th>Tipo</th>
                          <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalLinesRes.data.map((l, i) => (
                          <tr key={i}>
                            <td>{l.accountName}</td>
                            <td>
                              <span className={`badge ${l.type === 'DEBIT' ? 'badge-cyan' : 'badge-emerald'}`}>
                                {l.type === 'DEBIT' ? 'Débito' : 'Crédito'}
                              </span>
                            </td>
                            <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>
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

      {/* ANOMALIES */}
      {activeTab === 'ANOMALIES' && anomalyRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><ShieldAlert size={20} color="var(--rose-500)" /> Detector Preditivo de Anomalias Fiscais & Riscos de Glosa</h2>
            <span className="badge badge-rose">Análise de Risco Ativa</span>
          </div>

          <div className="grid-cards-4" style={{ marginBottom: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Anomalias Detectadas</span></div>
              <div className="metric-value font-mono" style={{ color: anomalyRes.data.totalAnomalias > 0 ? 'var(--rose-500)' : 'var(--emerald-400)' }}>
                {anomalyRes.data.totalAnomalias}
              </div>
              <div className="metric-sub">Inconsistências tributárias</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Severidade Máxima</span></div>
              <div className="metric-value" style={{ color: 'var(--rose-500)' }}>{anomalyRes.data.severidadeGeral}</div>
              <div className="metric-sub">Prioridade de saneamento</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Impacto Financeiro Risco</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--amber-500)' }}>
                R$ {anomalyRes.data.impactoFinanceiroTotalEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">Risco de pagamento a maior</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Status Auditoria</span></div>
              <div className="metric-value" style={{ color: 'var(--amber-500)' }}>ALERTA EMITIDO</div>
              <div className="metric-sub">Correção sugerida disponível</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {anomalyRes.data.anomalias.map(anom => (
              <div key={anom.id} style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--rose-500)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{anom.titulo}</h4>
                  <span className="badge badge-rose">{anom.severidade}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{anom.descricao}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--cyan-500)', marginBottom: '0.3rem' }}>
                  <strong>Fundamentação Legal:</strong> {anom.fundamentacaoLegal}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--emerald-400)' }}>
                  <strong>Ação de Correção Recomendada:</strong> {anom.sugestaoCorrecao}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CROSS AUDIT */}
      {activeTab === 'CROSS_AUDIT' && crossAuditRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><CheckCircle2 size={20} color="var(--emerald-500)" /> Pre-Flight Cross-Auditor (Cruzamento Fiscal EFD x ECF x DCTFWeb)</h2>
            <span className="badge badge-emerald">Score: {crossAuditRes.data.scoreConformidadeFiscal}/100</span>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
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
              <div className="metric-value font-mono" style={{ color: crossAuditRes.data.scoreConformidadeFiscal === 100 ? 'var(--emerald-400)' : 'var(--amber-500)' }}>
                {crossAuditRes.data.scoreConformidadeFiscal} %
              </div>
              <div className="metric-sub">Cruzamento perfeito RFB</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Divergências EFD x ECF</span></div>
              <div className="metric-value font-mono" style={{ color: crossAuditRes.data.anomaliasCriticas > 0 ? 'var(--rose-500)' : 'var(--emerald-400)' }}>
                {crossAuditRes.data.anomaliasCriticas}
              </div>
              <div className="metric-sub">Risco de malha fina fiscal</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Divergências DCTFWeb</span></div>
              <div className="metric-value font-mono" style={{ color: crossAuditRes.data.anomaliasAltas > 0 ? 'var(--rose-500)' : 'var(--emerald-400)' }}>
                {crossAuditRes.data.anomaliasAltas}
              </div>
              <div className="metric-sub">Divergência com eSocial / Reinf</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Total Divergências</span></div>
              <div className="metric-value font-mono" style={{ color: crossAuditRes.data.totalAnomalias === 0 ? 'var(--emerald-400)' : 'var(--amber-500)' }}>
                {crossAuditRes.data.totalAnomalias}
              </div>
              <div className="metric-sub">Gerações validadas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
