import React, { useState, useMemo } from 'react';
import {
  Zap,
  Calculator,
  FileSpreadsheet,
  Users,
  UploadCloud,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  QrCode,
  FileText,
  Play,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Plus,
  Sparkles
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const OfficeDailyOperationsHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'contabil' | 'fiscal' | 'dp'>('contabil');
  const [notification, setNotification] = useState<string | null>(null);

  // Estados Interativos da Rotina Contábil
  const [ofxEntries, setOfxEntries] = useState([
    { id: 1, date: '18/08/2026', memo: 'RECEBIMENTO CLIENTE NF 1042', val: 48500.00, type: 'CREDIT', debito: '1.1.01.002 (Banco)', credito: '1.1.02.001 (Clientes)', status: 'CONCILIADO' },
    { id: 2, date: '19/08/2026', memo: 'PAGTO FORNECEDOR MATERIAIS', val: -12800.00, type: 'DEBIT', debito: '2.1.01.001 (Fornecedores)', credito: '1.1.01.002 (Banco)', status: 'CONCILIADO' },
    { id: 3, date: '20/08/2026', memo: 'PAGTO ENERGIA ELETRICA ENEL', val: -3420.50, type: 'DEBIT', debito: '4.1.02.005 (Despesa Energia)', credito: '1.1.01.002 (Banco)', status: 'PENDENTE' }
  ]);

  // Estados Interativos da Rotina Fiscal
  const [faturamentoInput, setFaturamentoInput] = useState<number>(125000);
  const [anexoSimples, setAnexoSimples] = useState<'ANEXO_I' | 'ANEXO_III' | 'ANEXO_V'>('ANEXO_III');
  const aliquotaEfetiva = useMemo(() => {
    return anexoSimples === 'ANEXO_I' ? 0.04 : anexoSimples === 'ANEXO_III' ? 0.06 : 0.155;
  }, [anexoSimples]);
  const valorDasCalculado = useMemo(() => faturamentoInput * aliquotaEfetiva, [faturamentoInput, aliquotaEfetiva]);

  // Estados Interativos da Rotina de DP
  const [employees, setEmployees] = useState([
    { id: 1, name: 'CARLOS ALBERTO SILVA', cargo: 'Contador Sênior', salario: 8500.00, inss: 876.95, fgts: 680.00, liquido: 6540.20, status: 'TRANSMITIDO' },
    { id: 2, name: 'MARIANA COSTA SANTOS', cargo: 'Analista Fiscal Pleno', salario: 5200.00, inss: 532.40, fgts: 416.00, liquido: 4210.80, status: 'TRANSMITIDO' },
    { id: 3, name: 'ROBERTO PEREIRA LIMA', cargo: 'Assistente DP', salario: 3400.00, inss: 312.80, fgts: 272.00, liquido: 2950.40, status: 'PENDENTE' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleConciliarLinha = (id: number) => {
    setOfxEntries(prev => prev.map(item => item.id === id ? { ...item, status: 'CONCILIADO' } : item));
    showToast('Lançamento contábil conciliado em Partidas Dobradas com sucesso!');
  };

  const handleTransmitirHolerite = (id: number) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'TRANSMITIDO' } : emp));
    showToast('Holerite transmitido ao eSocial (S-1200) e liberado no Portal do Cliente!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', color: '#FFFFFF' }}>
      {/* Toast Notification */}
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

      {/* Header Executivo 3D 4K */}
      <div style={{
        background: 'linear-gradient(180deg, #18263D 0%, #0E1626 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderBottom: '3px solid rgba(56, 189, 248, 0.4)',
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
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(16, 185, 129, 0.2) 100%)',
            border: '1.5px solid #38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.45)'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Operações Diárias: Contábil, Fiscal & RH/DP
              </h1>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.66rem',
                fontWeight: 900
              }}>
                MOTOR INTERATIVO ACID
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.80rem' }}>
              Estação de trabalho operacional ativa: Conciliação OFX em Partidas Dobradas, Apuração de Impostos e Emissão de Holerites eSocial.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-navegação interna entre os 3 pilares */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'contabil', label: '1. Rotina Contábil (OFX & Razão)', icon: '📊', color: '#38BDF8' },
          { id: 'fiscal', label: '2. Rotina Fiscal (Apuração & Pix)', icon: '🧾', color: '#34D399' },
          { id: 'dp', label: '3. Rotina DP (Folha & eSocial)', icon: '👥', color: '#C084FC' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              background: activeSubTab === tab.id
                ? 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)'
                : 'linear-gradient(180deg, #141C2E 0%, #0A101C 100%)',
              color: activeSubTab === tab.id ? tab.color : '#94A3B8',
              border: activeSubTab === tab.id ? `1.5px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: activeSubTab === tab.id ? `3px solid ${tab.color}` : '2px solid rgba(0, 0, 0, 0.5)',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeSubTab === tab.id ? `0 0 14px ${tab.color}40` : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ABA 1: ROTINA CONTÁBIL (OFX & RAZÃO INTERATIVO) */}
      {activeSubTab === 'contabil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Extrato Bancário OFX & Partidas Dobradas Automáticas
                </h3>
                <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.74rem' }}>
                  Conta: <strong>Banco Itaú (341) Ag: 1234 / CC: 56789-0</strong> • Saldo Conciliado: R$ 480.000,00
                </p>
              </div>
              <button
                onClick={() => showToast('Novo extrato OFX importado e classificado com sucesso!')}
                style={{
                  background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                  border: '1px solid #38BDF8',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UploadCloud size={14} /> <span>Importar Extrato OFX</span>
              </button>
            </div>

            <table className="diamond-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Data / Descrição OFX</th>
                  <th style={{ textAlign: 'right' }}>Valor (R$)</th>
                  <th style={{ textAlign: 'left' }}>Débito</th>
                  <th style={{ textAlign: 'left' }}>Crédito</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {ofxEntries.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      <span style={{ color: '#94A3B8', fontSize: '0.70rem', marginRight: '8px' }}>{entry.date}</span>
                      {entry.memo}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: entry.val > 0 ? '#34D399' : '#F87171' }}>
                      {entry.val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ fontSize: '0.72rem', color: '#60A5FA' }}>{entry.debito}</td>
                    <td style={{ fontSize: '0.72rem', color: '#A78BFA' }}>{entry.credito}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: entry.status === 'CONCILIADO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: entry.status === 'CONCILIADO' ? '#34D399' : '#FBBF24',
                        border: entry.status === 'CONCILIADO' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                      }}>
                        {entry.status === 'CONCILIADO' ? '✓ Conciliado' : '⏳ Pendente'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {entry.status === 'PENDENTE' ? (
                        <button
                          onClick={() => handleConciliarLinha(entry.id)}
                          style={{
                            background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                            border: '1px solid #34D399',
                            color: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Conciliar
                        </button>
                      ) : (
                        <span style={{ color: '#34D399', fontSize: '0.70rem', fontWeight: 800 }}>Ok</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: ROTINA FISCAL (APURAÇÃO & GUIAS PIX) */}
      {activeSubTab === 'fiscal' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Simulador & Apurador Interativo PGDAS-D
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Faturamento do Período (R$):</label>
                <input
                  type="number"
                  value={faturamentoInput}
                  onChange={(e) => setFaturamentoInput(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#0B1120',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#34D399',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    outline: 'none',
                    marginTop: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Anexo do Simples Nacional:</label>
                <select
                  value={anexoSimples}
                  onChange={(e) => setAnexoSimples(e.target.value as any)}
                  style={{
                    width: '100%',
                    background: '#0B1120',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.80rem',
                    fontWeight: 800,
                    outline: 'none',
                    marginTop: '4px'
                  }}
                >
                  <option value="ANEXO_I">Anexo I - Comércio (Alíquota 4,00%)</option>
                  <option value="ANEXO_III">Anexo III - Serviços (Alíquota 6,00%)</option>
                  <option value="ANEXO_V">Anexo V - Tecnologia / Fator R (Alíquota 15,50%)</option>
                </select>
              </div>

              <div style={{ background: '#0B1120', padding: '12px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase' }}>Valor Total do DAS</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34D399' }}>
                    {valorDasCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
                <button
                  onClick={() => showToast('Guia DAS gerada e transmitida ao PGDAS-D com sucesso!')}
                  className="btn-1click-3d"
                >
                  <span>⚡</span> Emitir DAS
                </button>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
              Guia Pronta para Pagamento Pix
            </h3>
            <div style={{ background: '#0B1120', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Linha Digitável:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FFFFFF', wordBreak: 'break-all' }}>
                858300000018 75000000000 00000000000 00000000000
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px' }}>Pix Copia e Cola:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#38BDF8', wordBreak: 'break-all' }}>
                00020126580014br.gov.bcb.pix0136DAS_0001_PGDAS_SOBERANO_2026
              </div>
              <button
                onClick={() => showToast('Código Pix copiado para a área de transferência!')}
                style={{
                  background: 'linear-gradient(180deg, #18263D 0%, #0F172A 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '6px'
                }}
              >
                Copiar Pix Copia e Cola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: ROTINA DE DP / RH (FOLHA & ESOCIAL INTERATIVO) */}
      {activeSubTab === 'dp' && (
        <div style={{
          background: 'linear-gradient(180deg, #141E34 0%, #0A101C 100%)',
          border: '1.5px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                Quadro de Colaboradores & Apuração de Holerites
              </h3>
              <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.74rem' }}>
                Competência: 08/2026 • Encargos eSocial S-1200 / S-1210 / FGTS Digital
              </p>
            </div>
            <button
              onClick={() => showToast('Todos os holerites foram transmitidos ao eSocial!')}
              style={{
                background: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)',
                border: '1px solid #C084FC',
                color: '#FFFFFF',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} /> <span>Transmitir Todos eSocial</span>
            </button>
          </div>

          <table className="diamond-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Colaborador / Cargo</th>
                <th style={{ textAlign: 'right' }}>Salário Bruto</th>
                <th style={{ textAlign: 'right' }}>INSS Retido</th>
                <th style={{ textAlign: 'right' }}>FGTS (8%)</th>
                <th style={{ textAlign: 'right' }}>Líquido a Pagar</th>
                <th style={{ textAlign: 'center' }}>Status eSocial</th>
                <th style={{ textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                    <div>{emp.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>{emp.cargo}</div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#FFFFFF' }}>
                    {emp.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ textAlign: 'right', color: '#F87171', fontWeight: 700 }}>
                    {emp.inss.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ textAlign: 'right', color: '#38BDF8', fontWeight: 700 }}>
                    {emp.fgts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ textAlign: 'right', color: '#34D399', fontWeight: 800 }}>
                    {emp.liquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: emp.status === 'TRANSMITIDO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: emp.status === 'TRANSMITIDO' ? '#34D399' : '#FBBF24',
                      border: emp.status === 'TRANSMITIDO' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                    }}>
                      {emp.status === 'TRANSMITIDO' ? '✓ Transmitido' : '⏳ Pendente'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {emp.status === 'PENDENTE' ? (
                      <button
                        onClick={() => handleTransmitirHolerite(emp.id)}
                        style={{
                          background: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)',
                          border: '1px solid #C084FC',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Enviar
                      </button>
                    ) : (
                      <span style={{ color: '#34D399', fontSize: '0.70rem', fontWeight: 800 }}>✓ Pronto</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfficeDailyOperationsHubView;
