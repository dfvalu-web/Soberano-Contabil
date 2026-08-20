import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  AlertCircle,
  Play,
  RefreshCw
} from 'lucide-react';

export const OfficeUniversalDropzoneOcrView: React.FC = () => {
  const [docType, setDocType] = useState<'NFE_XML' | 'DANFE_PDF' | 'OFX_BANCO'>('NFE_XML');
  const [selectedPreset, setSelectedPreset] = useState<string>('sample-1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [batchProcessed, setBatchProcessed] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const sampleDocs = {
    'sample-1': {
      title: 'NF-e 10.492 • DISTRIBUIDORA FARMACÊUTICA BRASIL LTDA',
      chave: '3526.0812.3456.7800.0195.5500.1000.0123.4510.0012.3456',
      numero: '10492',
      serie: '1',
      emissao: '18/08/2026',
      emitente: 'DISTRIBUIDORA FARMACÊUTICA BRASIL LTDA (CNPJ: 12.345.678/0001-95)',
      destinatario: 'DROGARIA ALVORADA LTDA (CNPJ: 98.765.432/0001-11)',
      naturezaOperacao: 'VENDA DE MERCADORIAS (MONOFÁSICOS)',
      totalNota: 24850.00,
      itens: [
        { id: 1, desc: 'DIPIRONA SÓDICA 500MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', cstPis: '04 (Monofásico)', qtd: 800, unit: 15.00, total: 12000.00, debito: '1.1.03.01.001 (Estoque Medicamentos)', credito: '2.1.01.01.001 (Fornecedores)' },
        { id: 2, desc: 'PARACETAMOL 750MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', cstPis: '04 (Monofásico)', qtd: 514, unit: 25.00, total: 12850.00, debito: '1.1.03.01.001 (Estoque Medicamentos)', credito: '2.1.01.01.001 (Fornecedores)' }
      ]
    },
    'sample-2': {
      title: 'DANFE PDF 4.290 • INDÚSTRIA METALÚRGICA SOBERANA S/A',
      chave: '3526.0898.7654.3200.0144.5500.1000.0042.9010.0098.7654',
      numero: '4290',
      serie: '2',
      emissao: '19/08/2026',
      emitente: 'INDÚSTRIA METALÚRGICA SOBERANA S/A (CNPJ: 55.444.333/0001-22)',
      destinatario: 'SOBERANO CONSTRUÇÕES & ENGENHARIA LTDA',
      naturezaOperacao: 'VENDA DE PRODUÇÃO DO ESTABELECIMENTO',
      totalNota: 58900.00,
      itens: [
        { id: 1, desc: 'PERFIL DE AÇO GALVANIZADO 6 METROS', ncm: '72165000', cfop: '5101', cstPis: '01 (Tributável)', qtd: 200, unit: 294.50, total: 58900.00, debito: '1.1.03.02.001 (Estoque Matéria Prima)', credito: '2.1.01.01.001 (Fornecedores)' }
      ]
    }
  };

  const currentDoc = sampleDocs[selectedPreset as keyof typeof sampleDocs];

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProcessOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBatchProcessed(true);
      showToast('Documento processado via OCR Neural: Dados fiscais e partidas dobradas prontas!');
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          border: '1.5px solid #34D399',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header 3D 4K */}
      <div style={{
        background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderBottom: '3px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 24px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1.5px solid #34D399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
          }}>
            📂
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Dropzone Massivo Multi-Doc & OCR Inteligente
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                OCR NEURAL MULTI-FORMATO
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Ingestão inteligente de XMLs, DANFEs em PDF e Extratos OFX com contabilização automática.
            </p>
          </div>
        </div>
      </div>

      {/* Área Interativa de Dropzone & Amostras */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        <div style={{
          background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
          border: '2px dashed rgba(52, 211, 153, 0.5)',
          borderRadius: '12px',
          padding: '28px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <UploadCloud size={40} color="#34D399" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
              Arraste e solte arquivos aqui ou selecione um preset
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '4px' }}>
              Suporta XML NF-e/NFC-e/NFS-e, DANFE PDF e OFX Bancário
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              onClick={() => setSelectedPreset('sample-1')}
              style={{
                background: selectedPreset === 'sample-1' ? 'rgba(16, 185, 129, 0.25)' : '#0B1120',
                border: selectedPreset === 'sample-1' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.15)',
                color: selectedPreset === 'sample-1' ? '#34D399' : '#94A3B8',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Preset 1: NF-e Farmácia
            </button>
            <button
              onClick={() => setSelectedPreset('sample-2')}
              style={{
                background: selectedPreset === 'sample-2' ? 'rgba(16, 185, 129, 0.25)' : '#0B1120',
                border: selectedPreset === 'sample-2' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.15)',
                color: selectedPreset === 'sample-2' ? '#34D399' : '#94A3B8',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Preset 2: DANFE Metalúrgica
            </button>
          </div>

          <button
            onClick={handleProcessOCR}
            disabled={isProcessing}
            className="btn-1click-3d"
            style={{ marginTop: '8px' }}
          >
            <Play size={14} />
            <span>{isProcessing ? 'Processando OCR Neural...' : 'Processar Documento Selecionado'}</span>
          </button>
        </div>

        {/* Detalhes Extraídos pelo OCR */}
        <div style={{
          background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Dados Fiscais & Contábeis Extraídos
            </h3>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 800 }}>
              100% CONCILIADO
            </span>
          </div>

          <div style={{ background: '#0B1120', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
            <div><strong>Documento:</strong> <span style={{ color: '#38BDF8' }}>{currentDoc.title}</span></div>
            <div><strong>Chave de Acesso:</strong> <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{currentDoc.chave}</span></div>
            <div><strong>Valor Total:</strong> <span style={{ color: '#34D399', fontWeight: 900 }}>{currentDoc.totalNota.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
          </div>

          <table className="diamond-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Item / NCM</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ textAlign: 'left' }}>Débito / Crédito</th>
              </tr>
            </thead>
            <tbody>
              {currentDoc.itens.map(it => (
                <tr key={it.id}>
                  <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                    <div>{it.desc}</div>
                    <div style={{ fontSize: '0.66rem', color: '#94A3B8' }}>NCM: {it.ncm} • CFOP: {it.cfop}</div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>
                    {it.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ fontSize: '0.68rem' }}>
                    <div style={{ color: '#60A5FA' }}>D: {it.debito}</div>
                    <div style={{ color: '#A78BFA' }}>C: {it.credito}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => showToast('Partidas dobradas gravadas com sucesso no Razão Contábil!')}
            className="btn-1click-3d"
            style={{ marginTop: 'auto' }}
          >
            <Zap size={14} /> <span>Contabilizar em 1-Click</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficeUniversalDropzoneOcrView;
