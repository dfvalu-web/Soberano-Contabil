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
  AlertCircle
} from 'lucide-react';

export const OfficeUniversalDropzoneOcrView: React.FC = () => {
  const [docType, setDocType] = useState<'NFE_XML' | 'DANFE_PDF' | 'OFX_BANCO'>('NFE_XML');
  const [selectedPreset, setSelectedPreset] = useState<string>('sample-1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [batchProcessed, setBatchProcessed] = useState<boolean>(false);

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
      baseIcms: 0.00,
      valorIcms: 0.00,
      itens: [
        { id: 1, desc: 'DIPIRONA SÓDICA 500MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', cstPis: '04 (Monofásico)', qtd: 800, unit: 15.00, total: 12000.00, debitoConta: '1.1.03.01.001 (Estoque Medicamentos)', creditoConta: '2.1.01.01.001 (Fornecedores Nacionais)' },
        { id: 2, desc: 'PARACETAMOL 750MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', cstPis: '04 (Monofásico)', qtd: 514, unit: 25.00, total: 12850.00, debitoConta: '1.1.03.01.001 (Estoque Medicamentos)', creditoConta: '2.1.01.01.001 (Fornecedores Nacionais)' }
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
      baseIcms: 58900.00,
      valorIcms: 10602.00,
      itens: [
        { id: 1, desc: 'PERFIL DE AÇO GALVANIZADO 6 METROS', ncm: '72165000', cfop: '5101', cstPis: '01 (Tributável)', qtd: 200, unit: 294.50, total: 58900.00, debitoConta: '1.1.03.02.001 (Estoque Matéria Prima)', creditoConta: '2.1.01.01.001 (Fornecedores)' }
      ]
    }
  };

  const currentDoc = sampleDocs[selectedPreset as keyof typeof sampleDocs];

  const handleSimulateDropzoneBatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBatchProcessed(true);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header Diamond */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(2, 132, 199, 0.15) 100%)', border: '1.5px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)' }}>
            📂
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                Dropzone Massivo Multi-Doc & OCR Inteligente
              </h1>
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                IA AUTOCLASSIFICADORA
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Reconhecimento ótico (OCR) e parser nativo de XMLs, DANFEs em PDF e Extratos OFX com partida dobrada contábil instantânea.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSelectedPreset('sample-1')}
            style={{ background: selectedPreset === 'sample-1' ? 'rgba(16, 185, 129, 0.25)' : '#0B1120', border: selectedPreset === 'sample-1' ? '1.5px solid #34D399' : '1px solid rgba(255,255,255,0.1)', color: selectedPreset === 'sample-1' ? '#34D399' : '#94A3B8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Exemplo 1: NF-e Monofásica
          </button>
          <button
            onClick={() => setSelectedPreset('sample-2')}
            style={{ background: selectedPreset === 'sample-2' ? 'rgba(56, 189, 248, 0.25)' : '#0B1120', border: selectedPreset === 'sample-2' ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)', color: selectedPreset === 'sample-2' ? '#38BDF8' : '#94A3B8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Exemplo 2: Danfe Indústria (ICMS)
          </button>
        </div>
      </div>

      {/* Área de Dropzone 3D Interativa */}
      <div
        onClick={handleSimulateDropzoneBatch}
        style={{
          background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
          border: '2px dashed rgba(52, 211, 153, 0.6)',
          borderRadius: '16px',
          padding: '28px',
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 10px 28px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.15) 100%)', border: '1.5px solid #34D399', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
          <UploadCloud size={28} color="#34D399" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
          Arraste e Solte Lotes de Arquivos (.XML, .PDF, .OFX) ou Clique Aqui
        </h3>
        <p style={{ fontSize: '0.76rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 12px auto' }}>
          Processamento massivo simultâneo de até 500 documentos por segundo com extração de itens, segregação PIS/COFINS e conciliação automática.
        </p>
        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.35)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.70rem', fontWeight: 800 }}>
          {isProcessing ? '⚡ Processando com OCR & IA...' : '✨ Clique para Simular Upload em Lote'}
        </span>
      </div>

      {/* Split-View 3D 4K: Visualizador do Documento (Esq) vs Extrato Contábil/Fiscal (Dir) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(340px, 1.4fr)', gap: '16px', alignItems: 'start' }}>
        
        {/* Painel Esquerdo: Resumo do Documento e Dados Oficiais */}
        <div
          style={{
            background: 'linear-gradient(180deg, #141F36 0%, #0A101E 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderBottom: '3.5px solid #0284C7',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileText size={18} color="#38BDF8" />
            <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>Estrutura do Documento Eletrônico</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.76rem' }}>
            <div style={{ background: '#080D1A', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#64748B', fontSize: '0.64rem', fontWeight: 800, textTransform: 'uppercase' }}>Chave de Acesso DF-e (44 Dígitos)</div>
              <div style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)', fontWeight: 800, marginTop: '2px', wordBreak: 'break-all' }}>
                {currentDoc.chave}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#080D1A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#64748B', fontSize: '0.64rem', fontWeight: 800 }}>Nº DA NOTA</div>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '0.90rem' }}>{currentDoc.numero} / SÉRIE {currentDoc.serie}</div>
              </div>
              <div style={{ background: '#080D1A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#64748B', fontSize: '0.64rem', fontWeight: 800 }}>DATA DE EMISSÃO</div>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '0.90rem' }}>{currentDoc.emissao}</div>
              </div>
            </div>

            <div style={{ background: '#080D1A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#64748B', fontSize: '0.64rem', fontWeight: 800 }}>EMITENTE</div>
              <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.74rem' }}>{currentDoc.emitente}</div>
            </div>

            <div style={{ background: '#080D1A', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#64748B', fontSize: '0.64rem', fontWeight: 800 }}>DESTINATÁRIO</div>
              <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.74rem' }}>{currentDoc.destinatario}</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.35)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFFFFF' }}>Valor Total do Documento:</span>
              <strong style={{ fontSize: '1.2rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                R$ {currentDoc.totalNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

        {/* Painel Direito: Itens e Autoclassificação Contábil IFRS */}
        <div
          style={{
            background: 'linear-gradient(180deg, #141F36 0%, #0A101E 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.45)',
            borderBottom: '3.5px solid #059669',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#34D399" />
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>Itens Extraídos & Partidas Dobradas Sugeridas</span>
            </div>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 800 }}>
              {currentDoc.itens.length} ITENS CLASSIFICADOS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentDoc.itens.map(item => (
              <div
                key={item.id}
                style={{
                  background: '#080D1A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF' }}>
                    #{item.id} - {item.desc}
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                    R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.66rem', marginBottom: '8px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: '#94A3B8' }}>NCM: {item.ncm}</span>
                  <span style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px', color: '#38BDF8', fontWeight: 800 }}>CFOP: {item.cfop}</span>
                  <span style={{ background: 'rgba(251, 191, 36, 0.15)', padding: '2px 6px', borderRadius: '4px', color: '#FBBF24', fontWeight: 800 }}>PIS/COFINS: {item.cstPis}</span>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '8px', borderRadius: '6px', fontSize: '0.68rem' }}>
                  <div style={{ color: '#34D399', fontWeight: 800, marginBottom: '2px' }}>✓ Partida Dobrada Contábil Automática:</div>
                  <div style={{ color: '#E2E8F0' }}><strong>(D)</strong> {item.debitoConta}</div>
                  <div style={{ color: '#E2E8F0' }}><strong>(C)</strong> {item.creditoConta}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => alert('Escrituração transmitida com sucesso para a Esteira Fiscal e Contábil!')}
              className="btn-primary-action"
              style={{ flex: 1, padding: '10px', fontSize: '0.80rem', justifyContent: 'center' }}
            >
              <span>⚡</span> Integrar Lançamentos na Escrituração Oficial
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
export default OfficeUniversalDropzoneOcrView;
