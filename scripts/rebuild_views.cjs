const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '../packages/web/src/views');

// Helper to write file cleanly
function writeView(fileName, content) {
  fs.writeFileSync(path.join(viewsDir, fileName), content.trim(), 'utf8');
  console.log('Clean written:', fileName);
}

// 1. OfficeMultiClientClosingGridView.tsx
writeView('OfficeMultiClientClosingGridView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeMultiClientClosingGridView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [filterRegime, setFilterRegime] = useState<string>('ALL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Central de Fechamento Multi-Cliente & Cockpit Geral
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Visão Panorâmica da Carteira
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Acompanhamento em tempo real de DP, Fiscal, Contábil e CNDs de todas as empresas do escritório.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={filterRegime} onChange={(e) => setFilterRegime(e.target.value)} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            <option value="ALL">Todos os Regimes Tributários</option>
            <option value="SIMPLES_NACIONAL">Simples Nacional</option>
            <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
            <option value="LUCRO_REAL">Lucro Real</option>
          </select>
          <button onClick={() => alert('Competência fechada em lote!')} className="btn-primary-action">
            <span>⚡</span> Fechar Competência em Lote
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead><tr style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}><th style={{ padding: '12px 16px' }}>Empresa / CNPJ</th><th style={{ padding: '12px' }}>Regime</th><th style={{ padding: '12px' }}>DP & Folha</th><th style={{ padding: '12px' }}>Fiscal & DAS</th><th style={{ padding: '12px' }}>Contabilidade</th><th style={{ padding: '12px' }}>CNDs</th><th style={{ padding: '12px', textAlign: 'center' }}>Ações</th></tr></thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 700, color: '#fff' }}>{t.name}</div><div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CNPJ: {t.cnpj}</div></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>{t.regime.replace('_', ' ')}</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Fechada</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Transmitido</span></td>
                <td style={{ padding: '12px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>🟢 Conciliado</span></td>
                <td style={{ padding: '12px' }}><span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>✅ Em Dia</span></td>
                <td style={{ padding: '12px', textAlign: 'center' }}><button onClick={() => alert('Operando empresa ' + t.name)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>🔍 Operar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OfficeMultiClientClosingGridView;
`);

// 2. OfficeUniversalDropzoneOcrView.tsx
writeView('OfficeUniversalDropzoneOcrView.tsx', `
import React, { useState } from 'react';

export const OfficeUniversalDropzoneOcrView: React.FC = () => {
  const [xmlInput, setXmlInput] = useState<string>('');
  const [parsedDoc, setParsedDoc] = useState<any | null>(null);

  const sampleXml = '<nfeProc versao="4.00"><NFe><infNFe Id="NFe35260812345678000195550010000123451000123456"><emit><xNome>DISTRIBUIDORA FARMACEUTICA BRASIL LTDA</xNome></emit><total><ICMSTot><vNF>12500.00</vNF></ICMSTot></total></infNFe></NFe></nfeProc>';

  const handleParse = () => {
    setParsedDoc({
      chave: '3526.0812.3456.7800.0195.5500.1000.0123.4510.0012.3456',
      numero: '12345',
      emitente: 'DISTRIBUIDORA FARMACÊUTICA BRASIL LTDA',
      destinatario: 'DROGARIA ALVORADA LTDA',
      total: 12500.00,
      itens: [
        { item: 1, desc: 'DIPIRONA SÓDICA 500MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', qtd: 500, unit: 15.00, total: 7500.00, isMonofasico: true },
        { item: 2, desc: 'PARACETAMOL 750MG CX 20 COMPRIMIDOS', ncm: '30049099', cfop: '5102', qtd: 200, unit: 25.00, total: 5000.00, isMonofasico: true }
      ]
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Central Universal de Importação & Parser XML DF-e
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              NF-e / NFC-e / NFS-e / CT-e
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Leitura instantânea de documentos fiscais eletrônicos com segregação automática de itens monofásicos e ICMS-ST.
          </p>
        </div>
        <button onClick={() => { setXmlInput(sampleXml); handleParse(); }} className="btn-primary-action">
          <span>✨</span> Carregar XML Exemplo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '2px dashed var(--emerald-500)', borderRadius: '10px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>📂</span>
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginTop: '8px' }}>Arraste seus arquivos XML de DF-e aqui</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Suporta lotes com até 500 arquivos .xml simultâneos</div>
        </div>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>Ou Cole o Conteúdo do XML:</div>
          <textarea value={xmlInput} onChange={(e) => setXmlInput(e.target.value)} placeholder="Cole o código XML aqui..." className="font-mono" style={{ width: '100%', height: '110px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-medium)', color: 'var(--emerald-400)', padding: '8px', borderRadius: '6px', fontSize: '0.72rem' }} />
          <button onClick={handleParse} className="btn-primary-action" style={{ justifyContent: 'center' }}>⚡ Processar XML</button>
        </div>
      </div>

      {parsedDoc && (
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>
            NF-e Nº {parsedDoc.numero} • Chave: {parsedDoc.chave}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <div><strong>Emitente:</strong> {parsedDoc.emitente}</div>
            <div><strong>Destinatário:</strong> {parsedDoc.destinatario}</div>
            <div><strong>Total:</strong> R$ {parsedDoc.total.toFixed(2)}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead><tr style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}><th style={{ padding: '6px' }}>Item</th><th style={{ padding: '6px' }}>Descrição</th><th style={{ padding: '6px' }}>NCM</th><th style={{ padding: '6px' }}>CFOP</th><th style={{ padding: '6px' }}>Qtd</th><th style={{ padding: '6px' }}>Total</th><th style={{ padding: '6px' }}>Classificação</th></tr></thead>
            <tbody>{parsedDoc.itens.map((it: any) => (<tr key={it.item} style={{ borderBottom: '1px solid var(--border-subtle)' }}><td style={{ padding: '6px' }}>{it.item}</td><td style={{ padding: '6px', fontWeight: 700, color: '#fff' }}>{it.desc}</td><td className="font-mono" style={{ padding: '6px', color: 'var(--cyan-400)' }}>{it.ncm}</td><td style={{ padding: '6px' }}>{it.cfop}</td><td style={{ padding: '6px' }}>{it.qtd}</td><td className="font-mono" style={{ padding: '6px', fontWeight: 700 }}>R$ {it.total.toFixed(2)}</td><td style={{ padding: '6px' }}><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>Monofásico (Alíquota Zero)</span></td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default OfficeUniversalDropzoneOcrView;
`);

// 3. OfficeMonophasicTaxSegregationView.tsx
writeView('OfficeMonophasicTaxSegregationView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeMonophasicTaxSegregationView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t2'); // Drogaria Alvorada
  const [faturamentoTotal, setFaturamentoTotal] = useState<number>(180000);
  const [receitaMonofasica, setReceitaMonofasica] = useState<number>(115000);
  const [receitaIcmsSt, setReceitaIcmsSt] = useState<number>(115000);
  const [aliquotaEfetiva, setAliquotaEfetiva] = useState<number>(9.5); // %

  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[1], [tenants, selectedTenantId]);

  // Cálculo Simples Nacional PGDAS-D Segregado
  const dasNormalSemSegregacao = faturamentoTotal * (aliquotaEfetiva / 100);
  // Redução PIS (0.35%), COFINS (1.60%) e ICMS (3.40%)
  const reducaoPisCofins = receitaMonofasica * (0.0195);
  const reducaoIcmsSt = receitaIcmsSt * (0.0340);
  const totalEconomia = reducaoPisCofins + reducaoIcmsSt;
  const dasApuradoComSegregacao = Math.max(0, dasNormalSemSegregacao - totalEconomia);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💊</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Segregação de Receitas Monofásicas & PGDAS-D
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Simples Nacional & Lei Complementar 123/06
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Exclusão de PIS/COFINS monofásicos e ICMS-ST para Farmácias, Autopeças e Bebidas, gerando economia real no DAS.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>)}
          </select>
          <button onClick={() => alert('Guia DAS gerada com Pix!')} className="btn-primary-action">
            <span>🧾</span> Gerar Guia DAS Oficial
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>DAS SEM SEGREGAÇÃO (ERRADO)</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F87171', marginTop: '4px' }}>R$ {dasNormalSemSegregacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '0.7rem', color: '#F87171', marginTop: '4px' }}>Bitributação indevida</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ECONOMIA TRIBUTÁRIA REAL</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>- R$ {totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)', marginTop: '4px' }}>{((totalEconomia / dasNormalSemSegregacao) * 100).toFixed(1)}% de redução legal</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>DAS APURADO CORRETO</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>R$ {dasApuradoComSegregacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--cyan-400)', marginTop: '4px' }}>Guia pronta para recolhimento</div>
        </div>
      </div>
    </div>
  );
};
export default OfficeMonophasicTaxSegregationView;
`);

console.log('Core views 1, 2, 3 regenerated cleanly!');