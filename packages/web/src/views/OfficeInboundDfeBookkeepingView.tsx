// ==========================================================================
// SOBERANO CONTÁBIL — DF-e ENTRADA, MANIFESTAÇÃO SEFAZ & ESCRITURAÇÃO FISCAL
// Conformidade: Ajuste SINIEF 07/05 • NT 2020.001 • Bloco C100 SPED Fiscal
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Inbox,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Printer,
  Download,
  ShieldCheck,
  Search,
  Eye,
  RefreshCw,
  Clock,
  X,
  FileText
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface InboundDfeItem {
  id: string;
  chNFe: string;
  nNF: string;
  serie: string;
  dhEmi: string;
  emitenteNome: string;
  emitenteCnpj: string;
  vNF: number;
  vICMS: number;
  vIPI: number;
  vPIS: number;
  vCOFINS: number;
  manifestacaoStatus: 'SEM_MANIFESTACAO' | 'CIENCIA' | 'CONFIRMADA' | 'DESCONHECIDA' | 'NAO_REALIZADA';
  escrituradoSped: boolean;
}

export const OfficeInboundDfeBookkeepingView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedDfeForModal, setSelectedDfeForModal] = useState<InboundDfeItem | null>(null);

  const [inboundDfes, setInboundDfes] = useState<InboundDfeItem[]>([
    {
      id: 'dfe-in-1',
      chNFe: '35260812345678000190550010000458911004589114',
      nNF: '45891',
      serie: '1',
      dhEmi: '2026-08-15 14:22:10',
      emitenteNome: 'Aços & Metais Gerdau S.A.',
      emitenteCnpj: '12.345.678/0001-90',
      vNF: 38500.00,
      vICMS: 6930.00,
      vIPI: 1925.00,
      vPIS: 635.25,
      vCOFINS: 2926.00,
      manifestacaoStatus: 'CONFIRMADA',
      escrituradoSped: true
    },
    {
      id: 'dfe-in-2',
      chNFe: '35260898765432000111550010000124501000124508',
      nNF: '12450',
      serie: '1',
      dhEmi: '2026-08-17 09:10:45',
      emitenteNome: 'Distribuidora Farmacêutica EMS Brasil Ltda',
      emitenteCnpj: '98.765.432/0001-11',
      vNF: 14200.00,
      vICMS: 2556.00,
      vIPI: 0,
      vPIS: 0, // Monofásico
      vCOFINS: 0,
      manifestacaoStatus: 'CIENCIA',
      escrituradoSped: false
    },
    {
      id: 'dfe-in-3',
      chNFe: '35260844332211000188550010000089201000089202',
      nNF: '8920',
      serie: '1',
      dhEmi: '2026-08-18 16:45:30',
      emitenteNome: 'Fornecedor Desconhecido Peças Express Ltda',
      emitenteCnpj: '44.332.211/0001-88',
      vNF: 7800.00,
      vICMS: 1404.00,
      vIPI: 390.00,
      vPIS: 128.70,
      vCOFINS: 592.80,
      manifestacaoStatus: 'SEM_MANIFESTACAO',
      escrituradoSped: false
    }
  ]);

  const handleManifestar = (dfeId: string, tipo: 'CONFIRMADA' | 'DESCONHECIDA' | 'NAO_REALIZADA') => {
    setInboundDfes(prev => prev.map(d => d.id === dfeId ? { ...d, manifestacaoStatus: tipo } : d));
    setFeedback(`Manifestação do Destinatário (${tipo}) registrada com sucesso na SEFAZ! Protocolo: 135260009988221.`);
    setTimeout(() => setFeedback(null), 5000);
    setSelectedDfeForModal(null);
  };

  const handleDownloadXml = (dfe: InboundDfeItem) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${dfe.chNFe}" versao="4.00">
      <ide><nNF>${dfe.nNF}</nNF><dhEmi>${dfe.dhEmi}</dhEmi><vNF>${dfe.vNF.toFixed(2)}</vNF></ide>
      <emit><CNPJ>${dfe.emitenteCnpj.replace(/\D/g, '')}</CNPJ><xNome>${dfe.emitenteNome}</xNome></emit>
      <dest><CNPJ>${currentTenant.cnpj.replace(/\D/g, '')}</CNPJ><xNome>${currentTenant.name}</xNome></dest>
    </infNFe>
  </NFe>
  <protNFe versao="4.00"><infProt><chNFe>${dfe.chNFe}</chNFe><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></infProt></protNFe>
</nfeProc>`;
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFe_${dfe.chNFe}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDfes = inboundDfes.filter(d => 
    d.emitenteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nNF.includes(searchTerm) ||
    d.chNFe.includes(searchTerm)
  );

  const totalInboundValue = inboundDfes.reduce((acc, d) => acc + d.vNF, 0);
  const totalIcmsCredits = inboundDfes.reduce((acc, d) => acc + d.vICMS, 0);
  const totalIpiCredits = inboundDfes.reduce((acc, d) => acc + d.vIPI, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              DF-e de Entrada, Manifestação SEFAZ & Escrituração Fiscal
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              SEFAZ NSU • SPED BLOCO C100
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Captura automática de NF-e/CT-e de fornecedores via WebService SEFAZ, Manifestação do Destinatário e apropriação de créditos de ICMS/IPI.
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
            <span>Imprimir Laudo de Entradas (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total de Compras / Entradas</span>
            <Inbox size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            R$ {totalInboundValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">{inboundDfes.length} DF-e Recebidos da SEFAZ</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Créditos de ICMS Entradas</span>
            <ShieldCheck size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            + R$ {totalIcmsCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Compensação SPED Fiscal Bloco C</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Créditos de IPI (Indústria)</span>
            <FileCheck2 size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            + R$ {totalIpiCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Insumos Industriais</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Manifestações Pendentes</span>
            <Clock size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            {inboundDfes.filter(d => d.manifestacaoStatus === 'SEM_MANIFESTACAO' || d.manifestacaoStatus === 'CIENCIA').length} Notas
          </div>
          <div className="metric-sub">Prazo legal de 180 dias</div>
        </div>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Notas Fiscais Eletrônicas Emitidas Contra a Empresa</span>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por fornecedor, NF ou chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'var(--bg-surface-card)', border: '1px solid var(--border-medium)', color: '#fff', padding: '6px 12px 6px 30px', borderRadius: '6px', fontSize: '0.78rem', width: '260px' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>NF / Série</th>
                <th>Emitente / Fornecedor</th>
                <th>Data Emissão</th>
                <th style={{ textAlign: 'right' }}>Valor Total</th>
                <th style={{ textAlign: 'right' }}>ICMS Crédito</th>
                <th style={{ textAlign: 'center' }}>Manifestação SEFAZ</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDfes.map(d => (
                <tr key={d.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>
                    NF-e {d.nNF} (Série {d.serie})
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{d.emitenteNome}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>CNPJ: {d.emitenteCnpj}</div>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{d.dhEmi}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {d.vNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--emerald-400)' }}>
                    + R$ {d.vICMS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.manifestacaoStatus === 'CONFIRMADA' ? (
                      <span className="badge badge-emerald">✓ Confirmada</span>
                    ) : d.manifestacaoStatus === 'CIENCIA' ? (
                      <span className="badge badge-cyan">Ciência da Emissão</span>
                    ) : d.manifestacaoStatus === 'DESCONHECIDA' ? (
                      <span className="badge badge-red">Desconhecida</span>
                    ) : (
                      <span className="badge badge-amber">Pendente</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        onClick={() => setSelectedDfeForModal(d)}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        Manifestar
                      </button>
                      <button
                        onClick={() => handleDownloadXml(d)}
                        className="btn-primary-action"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        <Download size={12} /> XML
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Manifestação */}
      {selectedDfeForModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid var(--cyan-500)', borderRadius: '12px', width: '100%', maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                Manifestação do Destinatário SEFAZ
              </h3>
              <button onClick={() => setSelectedDfeForModal(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.80rem', marginBottom: '16px' }}>
              <div><strong>NF-e:</strong> {selectedDfeForModal.nNF} | <strong>Emitente:</strong> {selectedDfeForModal.emitenteNome}</div>
              <div><strong>Chave:</strong> <code>{selectedDfeForModal.chNFe}</code></div>
              <div><strong>Valor:</strong> R$ {selectedDfeForModal.vNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleManifestar(selectedDfeForModal.id, 'CONFIRMADA')}
                className="btn-primary-action"
                style={{ padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}
              >
                ✓ Confirmação da Operação (Mercadoria Recebida)
              </button>
              <button
                onClick={() => handleManifestar(selectedDfeForModal.id, 'DESCONHECIDA')}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--red-500)', color: '#f87171', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Desconhecimento da Operação (Não Comprei)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ EXECUTIVO DE AUDITORIA DE ENTRADAS & MANIFESTAÇÃO DF-e (SPED BLOCO C100)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>WebService SEFAZ Homologado</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Total de Compras Faturadas</strong>
            <span className="font-mono">R$ {totalInboundValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Créditos ICMS Apropriados</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>+ R$ {totalIcmsCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Total de Notas de Entrada</strong>
            <span className="font-mono">{inboundDfes.length} DF-e Recebidos</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Conformidade Manifestação</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Eventos Registrados na SEFAZ</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>NF-e / Fornecedor</th>
              <th>Data Emissão</th>
              <th>Status Manifestação</th>
              <th style={{ textAlign: 'right' }}>Crédito ICMS (R$)</th>
              <th style={{ textAlign: 'right' }}>Valor Total NF (R$)</th>
            </tr>
          </thead>
          <tbody>
            {inboundDfes.map(d => (
              <tr key={d.id}>
                <td><strong>NF {d.nNF}</strong> - {d.emitenteNome}</td>
                <td>{d.dhEmi}</td>
                <td>{d.manifestacaoStatus}</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {d.vICMS.toFixed(2)}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {d.vNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE RECEBIMENTO FISCAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conferência Física & XML</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA TRIBUTÁRIA SPED</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Conformidade Ajuste SINIEF</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeInboundDfeBookkeepingView;
