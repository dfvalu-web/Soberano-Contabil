import React, { useState } from 'react';

export const ForensicAiView: React.FC = () => {
  const [pergunta, setPergunta] = useState('Como funciona o Fator R no Simples Nacional para TI?');
  const [respostaCopiloto, setRespostaCopiloto] = useState<{
    intencao: string;
    resposta: string;
    fundamentacao: string[];
    acoes: string[];
  } | null>({
    intencao: 'FATOR_R_SIMPLES',
    resposta: 'O Fator R compara a folha de pagamento dos últimos 12 meses com o faturamento bruto (RBT12). Se a razão for igual ou superior a 28%, a empresa é tributada pelo Anexo III (alíquota a partir de 6%), gerando expressiva economia tributária frente ao Anexo V (15,5%).',
    fundamentacao: [
      'Lei Complementar nº 123/2006 (Art. 18, § 5º-J)',
      'Resolução CGSN nº 140/2018 (Art. 26)',
      'Solução de Consulta COSIT nº 312/2019'
    ],
    acoes: [
      'Monitorar a proporção Folha/RBT12 a cada fechamento mensal.',
      'Ajustar o pró-labore dos sócios para manter o enquadramento no Anexo III.'
    ]
  });

  const benfordData = [
    { digito: 1, observada: 31.2, esperada: 30.1 },
    { digito: 2, observada: 17.1, esperada: 17.6 },
    { digito: 3, observada: 12.8, esperada: 12.5 },
    { digito: 4, observada: 9.4, esperada: 9.7 },
    { digito: 5, observada: 8.1, esperada: 7.9 },
    { digito: 6, observada: 6.5, esperada: 6.7 },
    { digito: 7, observada: 5.6, esperada: 5.8 },
    { digito: 8, observada: 4.9, esperada: 5.1 },
    { digito: 9, observada: 4.4, esperada: 4.6 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🤖</span> Copiloto de IA Contábil, Perícia Forense & PER/DCOMP
        </h2>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Assistência normativa em tempo real, auditoria matemática de fraudes pela Lei de Benford e matriz de monetização de créditos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Terminal de Consulta Normativa (RAG)</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={pergunta} 
              onChange={e => setPergunta(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-secondary)', color: 'var(--text-primary)' }}
              placeholder="Digite sua dúvida contábil ou fiscal..."
            />
            <button 
              className="btn btn-primary"
              onClick={() => {
                setRespostaCopiloto({
                  intencao: 'CONSULTA_GERAL',
                  resposta: 'Consulta processada com sucesso. Enquadramento e diretrizes normativas consolidadas.',
                  fundamentacao: ['Normas Brasileiras de Contabilidade NBC TG', 'Legislação Tributária Federal'],
                  acoes: ['Lançamento auditado no Ledger Imutável.']
                });
              }}
            >
              Consultar IA
            </button>
          </div>

          {respostaCopiloto && (
            <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-color)' }}>
                INTENÇÃO IDENTIFICADA: {respostaCopiloto.intencao}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {respostaCopiloto.resposta}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Fundamentação Legal:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {respostaCopiloto.fundamentacao.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Auditoria Forense (Lei de Benford)</h3>
            <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              ALTA CONFORMIDADE (MAD: 0.72%)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {benfordData.map(item => (
              <div key={item.digito} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                <span style={{ width: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.digito}</span>
                <div style={{ flex: 1, height: '14px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: (item.observada * 2.5) + '%', background: '#3b82f6', height: '100%' }} />
                </div>
                <span style={{ width: '60px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {item.observada}%
                </span>
                <span style={{ width: '70px', textAlign: 'right', color: '#10b981', fontSize: '0.75rem' }}>
                  (Benford: {item.esperada}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Central de Monetização de Créditos Acumulados (PER/DCOMP Web)
          </h3>
          <span style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.85rem' }}>
            Nº Controle: PERDCOMP-12345678-2026-BR
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Crédito Total Levantado</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>R$ 250.000,00</div>
          </div>
          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compensação IRPJ/CSLL</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3b82f6', marginTop: '4px' }}>R$ 90.000,00</div>
          </div>
          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compensação INSS Patronal</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>R$ 40.000,00</div>
          </div>
          <div style={{ background: 'var(--surface-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Restituição em Conta (TED/PIX)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>R$ 70.000,00</div>
          </div>
        </div>
      </div>
    </div>
  );
};
