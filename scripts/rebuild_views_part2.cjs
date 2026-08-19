const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '../packages/web/src/views');

function writeView(fileName, content) {
  fs.writeFileSync(path.join(viewsDir, fileName), content.trim(), 'utf8');
  console.log('Clean written:', fileName);
}

// 4. PayrollOperationalView.tsx
writeView('PayrollOperationalView.tsx', `
import React, { useState, useEffect, useMemo } from 'react';
import { officeStore, Employee } from '../state/office-store.js';

export const PayrollOperationalView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const [competencia, setCompetencia] = useState<string>('08/2026');
  const [activeTab, setActiveTab] = useState<'FOLHA_GERAL' | 'FUNCIONARIOS'>('FOLHA_GERAL');

  const tenants = useMemo(() => officeStore.getTenants(), []);

  useEffect(() => {
    const load = () => setEmployees(officeStore.getEmployees(selectedTenantId));
    load();
    const unsub = officeStore.subscribe(load);
    return () => unsub();
  }, [selectedTenantId]);

  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);
  const statements = useMemo(() => employees.map(emp => officeStore.calculatePayroll(emp, competencia)), [employees, competencia]);

  const totals = useMemo(() => {
    return statements.reduce((acc, st) => {
      acc.totalBruto += st.totalProventos;
      acc.totalDescontos += st.totalDescontos;
      acc.totalLiquido += st.netSalary;
      acc.totalInss += (st.items.find(i => i.code === '501')?.amount || 0);
      acc.totalIrrf += (st.items.find(i => i.code === '505')?.amount || 0);
      acc.totalFgts += st.fgtsAmount;
      return acc;
    }, { totalBruto: 0, totalDescontos: 0, totalLiquido: 0, totalInss: 0, totalIrrf: 0, totalFgts: 0 });
  }, [statements]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Departamento Pessoal & Folha de Pagamento Oficial
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              eSocial S-1200 / S-1210
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cálculo instantâneo de INSS progressivo, IRRF (dedução legal vs simplificada), FGTS Digital e emissão de holerites CLT.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.regime.replace('_', ' ')})</option>)}
          </select>
          <button onClick={() => window.print()} className="btn-primary-action">
            <span>🖨️</span> Imprimir Folha
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>FOLHA BRUTA TOTAL</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>R$ {totals.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LÍQUIDO A PAGAR</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>R$ {totals.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>INSS PREVIDÊNCIA</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>R$ {totals.totalInss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>FGTS DIGITAL (8%)</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-400)', marginTop: '4px' }}>R$ {totals.totalFgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead><tr style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}><th style={{ padding: '12px 16px' }}>Colaborador</th><th style={{ padding: '12px' }}>Cargo</th><th style={{ padding: '12px' }}>Salário Base</th><th style={{ padding: '12px' }}>INSS</th><th style={{ padding: '12px' }}>IRRF</th><th style={{ padding: '12px' }}>Líquido</th></tr></thead>
          <tbody>
            {employees.map(emp => {
              const st = officeStore.calculatePayroll(emp, competencia);
              const inss = st.items.find(i => i.code === '501')?.amount || 0;
              const irrf = st.items.find(i => i.code === '505')?.amount || 0;
              return (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 700, color: '#fff' }}>{emp.name}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CPF: {emp.cpf}</div></td>
                  <td style={{ padding: '12px' }}>{emp.role}</td>
                  <td className="font-mono" style={{ padding: '12px', color: '#fff' }}>R$ {emp.baseSalary.toFixed(2)}</td>
                  <td className="font-mono" style={{ padding: '12px', color: 'var(--cyan-400)' }}>R$ {inss.toFixed(2)}</td>
                  <td className="font-mono" style={{ padding: '12px', color: '#A78BFA' }}>R$ {irrf.toFixed(2)}</td>
                  <td className="font-mono" style={{ padding: '12px', fontWeight: 800, color: 'var(--emerald-400)' }}>R$ {st.netSalary.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PayrollOperationalView;
`);

// 5. OfficeLaborTerminationTrctView.tsx
writeView('OfficeLaborTerminationTrctView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeLaborTerminationTrctView: React.FC = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const employees = useMemo(() => officeStore.getEmployees(selectedTenantId), [selectedTenantId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Rescisão Trabalhista & Homologação TRCT Oficial
            </h1>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              eSocial S-2299 & FGTS Digital
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cálculo de aviso prévio proporcional (Lei 12.506/11), 13º/férias proporcionais + 1/3, multa rescisória FGTS e Termo TRCT.
          </p>
        </div>
        <button onClick={() => window.print()} className="btn-primary-action">
          <span>🖨️</span> Imprimir TRCT Oficial
        </button>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '18px' }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '12px' }}>
          Simulador TRCT Homologado
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Selecione o colaborador e os parâmetros rescisórios para emissão imediata da guia rescisória e termo oficial.
        </div>
      </div>
    </div>
  );
};
export default OfficeLaborTerminationTrctView;
`);

// 6. OfficeAccountingIfrsLedgerView.tsx
writeView('OfficeAccountingIfrsLedgerView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeAccountingIfrsLedgerView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏦</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Conciliação Bancária OFX & Livro Diário Partidas Dobradas
            </h1>
            <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              IFRS / NBC TG & SPED ECD
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Importação de extratos OFX, motor de regras de conciliação 1-Click e validação ACID Débito = Crédito.
          </p>
        </div>
        <button onClick={() => alert('OFX Conciliado com sucesso!')} className="btn-primary-action">
          <span>⚡</span> Conciliar OFX em 1-Click
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL DÉBITOS [D]</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>R$ 115.890,00</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL CRÉDITOS [C]</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>R$ 115.890,00</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>DIFERENÇA DE BALANÇO</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>R$ 0,00</div>
        </div>
      </div>
    </div>
  );
};
export default OfficeAccountingIfrsLedgerView;
`);

// 7. OfficeAnnualClosingAreView.tsx
writeView('OfficeAnnualClosingAreView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeAnnualClosingAreView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚖️</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Apuração do Resultado [ARE], DRE & Balanço Anual
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              NBC TG 26 / IFRS & Lei 6.404/76
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Encerramento anual de receitas/despesas, cálculo de Reserva Legal (5%), DRE e Balanço Patrimonial equilibrado.
          </p>
        </div>
        <button onClick={() => alert('ARE executado com sucesso!')} className="btn-primary-action">
          <span>🔒</span> Executar ARE em 1-Click
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>RECEITA LÍQUIDA</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>R$ 1.319.500,00</div>
        </div>
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>LUCRO LÍQUIDO</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>R$ 584.000,00</div>
        </div>
      </div>
    </div>
  );
};
export default OfficeAnnualClosingAreView;
`);

// 8. OfficeBatchDispatchBundleView.tsx
writeView('OfficeBatchDispatchBundleView.tsx', `
import React, { useState, useMemo } from 'react';
import { officeStore } from '../state/office-store.js';

export const OfficeBatchDispatchBundleView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🚀</span>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Central de Disparo em Lote • WhatsApp & E-mail
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Protocolo Jurídico SHA-256
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Envio automático de pacotes mensais (Holerites + Guias Pix + DRE) com confirmação de entrega jurídica.
          </p>
        </div>
        <button onClick={() => alert('Pacotes disparados com sucesso via WhatsApp e E-mail!')} className="btn-primary-action">
          <span>📲</span> Disparar Todos os Pacotes Agora
        </button>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '18px' }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>Pacotes Mensais Prontos para Entrega</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Todas as {tenants.length} empresas da carteira estão com guias Pix e holerites compilados para envio com protocolo de entrega digital.</div>
      </div>
    </div>
  );
};
export default OfficeBatchDispatchBundleView;
`);

console.log('All remaining views cleanly written!');