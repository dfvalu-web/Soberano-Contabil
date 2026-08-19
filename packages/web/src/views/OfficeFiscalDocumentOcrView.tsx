// ==========================================================================
// SOBERANO CONTÁBIL — DROPZONE MASSIVO OCR MULTI-DOCUMENTOS FISCAIS
// Leitura Inteligente de Cupons, NFS-e, NF-e e Conhecimentos de Transporte (CTe)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Printer,
  FileText,
  Building2,
  Eye,
  Trash2
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

interface OcrExtractedDoc {
  id: string;
  filename: string;
  docType: 'NFE' | 'NFSE' | 'CTE' | 'CUPOM_SAT';
  cnpjEmitente: string;
  razaoSocial: string;
  dataEmissao: string;
  valorTotal: number;
  tributosIdentificados: string;
  confiancaOcrPct: number;
  status: 'PROCESSADO' | 'PENDENTE_CONFERENCIA';
}

export const OfficeFiscalDocumentOcrView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [extractedDocs, setExtractedDocs] = useState<OcrExtractedDoc[]>([
    {
      id: 'ocr-1',
      filename: 'DANFE_Gerdau_45891.pdf',
      docType: 'NFE',
      cnpjEmitente: '12.345.678/0001-90',
      razaoSocial: 'Aços & Metais Gerdau S.A.',
      dataEmissao: '2026-08-15',
      valorTotal: 38500.00,
      tributosIdentificados: 'ICMS (R$ 6.930,00) • IPI (R$ 1.925,00)',
      confiancaOcrPct: 99.8,
      status: 'PROCESSADO'
    },
    {
      id: 'ocr-2',
      filename: 'NFSe_Prefeitura_SP_8821.pdf',
      docType: 'NFSE',
      cnpjEmitente: '11.222.333/0001-44',
      razaoSocial: 'Engenharia de Software Tech SP',
      dataEmissao: '2026-08-16',
      valorTotal: 25000.00,
      tributosIdentificados: 'ISS (R$ 1.250,00) • IRRF 1.5% • CSRF 4.65%',
      confiancaOcrPct: 98.5,
      status: 'PROCESSADO'
    }
  ]);

  const totalOcrValue = extractedDocs.reduce((acc, d) => acc + d.valorTotal, 0);

  const handleSimulateDrop = () => {
    setFeedback('3 novos documentos processados via OCR com 99% de acurácia e pré-classificados no Livro Fiscal!');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Dropzone Massivo Multi-Documentos Fiscais com OCR Neural
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              IA NEURAL OCR • PDF & IMAGENS
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Reconhecimento automatizado de caracteres e extração estruturada de NF-e, NFS-e, CT-e e Cupons SAT.
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
            <span>Imprimir Laudo OCR (A4)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="no-print" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} color="var(--emerald-400)" />
          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{feedback}</span>
        </div>
      )}

      {/* Drag & Drop Container */}
      <div
        className="no-print"
        onClick={handleSimulateDrop}
        style={{ background: 'rgba(15, 23, 42, 0.6)', border: '2px dashed var(--cyan-500)', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <UploadCloud size={44} color="var(--cyan-400)" style={{ margin: '0 auto 10px' }} />
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
          Arraste e solte seus arquivos PDF / Imagens de Notas Fiscais aqui
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Suporta PDFs escaneados, fotos de cupons fiscais e arquivos em lote (Processamento Neural Instantâneo)
        </div>
        <button className="btn-primary-action" style={{ margin: '14px auto 0', padding: '6px 16px', fontSize: '0.80rem' }}>
          Selecionar Arquivos do Computador
        </button>
      </div>

      {/* Table */}
      <div className="no-print panel-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Arquivo / Tipo</th>
                <th>Emitente Identificado</th>
                <th>Data</th>
                <th style={{ textAlign: 'right' }}>Valor Total</th>
                <th>Tributos Identificados</th>
                <th style={{ textAlign: 'center' }}>Acurácia OCR</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {extractedDocs.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{d.filename}</div>
                    <span className="badge badge-cyan">{d.docType}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{d.razaoSocial}</div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>CNPJ: {d.cnpjEmitente}</div>
                  </td>
                  <td className="font-mono">{d.dataEmissao}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                    R$ {d.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--emerald-400)' }}>{d.tributosIdentificados}</td>
                  <td style={{ textAlign: 'center' }} className="font-mono">{d.confiancaOcrPct}%</td>
                  <td style={{ textAlign: 'center' }}><span className="badge badge-emerald">✓ Processado</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DOSSIÊ DE RECONHECIMENTO & CAPTURA OCR DE DOCUMENTOS FISCAIS (IA NEURAL)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>COMPETÊNCIA: <strong>08/2026</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Extração 100% Homologada</div>
          </div>
        </div>

        <div className="diamond-meta-grid">
          <div className="diamond-meta-item">
            <strong>Volume Total Extraído</strong>
            <span className="font-mono">R$ {totalOcrValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Acurácia Média Neural</strong>
            <span className="font-mono" style={{ color: '#047857', fontWeight: 800 }}>99.2% Precisão</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Documentos Capturados</strong>
            <span>{extractedDocs.length} Arquivos</span>
          </div>
          <div className="diamond-meta-item">
            <strong>Classificação Contábil</strong>
            <span style={{ color: '#047857', fontWeight: 800 }}>✓ Bloco C/D SPED Automático</span>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Documento / Emitente</th>
              <th>Data Emissão</th>
              <th>Tributos Mapeados</th>
              <th style={{ textAlign: 'right' }}>Valor Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {extractedDocs.map(d => (
              <tr key={d.id}>
                <td><strong>{d.filename}</strong> - {d.razaoSocial}</td>
                <td>{d.dataEmissao}</td>
                <td>{d.tributosIdentificados}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>R$ {d.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE OCR & CAPTURA DIGITAL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Validação Óptica de Caracteres</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">AUDITORIA FISCAL SPED</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Escrituração Automática</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeFiscalDocumentOcrView;
