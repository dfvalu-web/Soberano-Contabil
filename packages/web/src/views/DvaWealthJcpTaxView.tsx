// ==========================================================================
// SOBERANO CONTÁBIL — DEMONSTRAÇÃO DO VALOR ADICIONADO (DVA - CPC 09 / NBC TG 09)
// Distribuição da Riqueza Gerada & Planejamento Tributário de JCP (Lei 9.249/95)
// ==========================================================================

import React, { useState, useMemo } from 'react';
import {
  Diamond,
  TrendingUp,
  Percent,
  DollarSign,
  Printer,
  ShieldCheck,
  Building2,
  Users,
  Landmark,
  PiggyBank,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { officeStore } from '../state/office-store.js';

export const DvaWealthJcpTaxView: React.FC = () => {
  const tenants = useMemo(() => officeStore.getTenants(), []);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t1');
  const currentTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || tenants[0], [tenants, selectedTenantId]);

  const [exercicio, setExercicio] = useState<string>('Exercício 2026');

  // 1. Receitas
  const [vendasBrutas, setVendasBrutas] = useState<number>(14500000.00);
  const [outrasReceitas, setOutrasReceitas] = useState<number>(250000.00);

  // 2. Insumos Adquiridos de Terceiros
  const [custosMateriasPrimasMercadorias, setCustosMateriasPrimasMercadorias] = useState<number>(4800000.00);
  const [materiaisEnergiaServicosTerceiros, setMateriaisEnergiaServicosTerceiros] = useState<number>(1600000.00);
  const [depreciacaoAmortizacao, setDepreciacaoAmortizacao] = useState<number>(450000.00);

  // 3. Recebidos em Transferência
  const [receitasFinanceirasMep, setReceitasFinanceirasMep] = useState<number>(380000.00);

  // 4. Distribuição
  const [salariosBeneficiosFgts, setSalariosBeneficiosFgts] = useState<number>(2600000.00);
  const [tributosFederaisEstaduaisMunicipais, setTributosFederaisEstaduaisMunicipais] = useState<number>(2900000.00);
  const [jurosAlugueisTerceiros, setJurosAlugueisTerceiros] = useState<number>(850000.00);
  const [dividendosJcpRetidos, setDividendosJcpRetidos] = useState<number>(1930000.00);

  // Cálculos DVA
  const receitaTotal = vendasBrutas + outrasReceitas;
  const insumosTotais = custosMateriasPrimasMercadorias + materiaisEnergiaServicosTerceiros;
  const valorAdicionadoBruto = receitaTotal - insumosTotais;
  const valorAdicionadoLiquido = valorAdicionadoBruto - depreciacaoAmortizacao;
  const valorAdicionadoTotalDistribuir = valorAdicionadoLiquido + receitasFinanceirasMep;

  // Percentuais de Distribuição
  const pctPessoal = ((salariosBeneficiosFgts / valorAdicionadoTotalDistribuir) * 100);
  const pctGoverno = ((tributosFederaisEstaduaisMunicipais / valorAdicionadoTotalDistribuir) * 100);
  const pctTerceiros = ((jurosAlugueisTerceiros / valorAdicionadoTotalDistribuir) * 100);
  const pctAcionistas = ((dividendosJcpRetidos / valorAdicionadoTotalDistribuir) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div className="no-print" style={{ background: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💎</span>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Demonstração do Valor Adicionado (DVA - CPC 09) & JCP
            </h1>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
              CPC 09 • LEI 11.638/07 • LEI 9.249/95 (JCP)
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Evidenciação da riqueza gerada pela empresa e a proporção de distribuição entre Pessoal, Governo, Credores e Acionistas.
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
            <span>Imprimir DVA Diamante (A4)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid-cards-4">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Riqueza Total a Distribuir</span>
            <Diamond size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
            R$ {valorAdicionadoTotalDistribuir.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="metric-sub">Valor Adicionado Líquido + Transferências</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Pessoal & Encargos (Salários)</span>
            <Users size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--cyan-400)' }}>
            {pctPessoal.toFixed(1)}% (R$ {salariosBeneficiosFgts.toLocaleString('pt-BR')})
          </div>
          <div className="metric-sub">Remuneração Direta + Benefícios + FGTS</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Governo & Tributos (RFB/SEFAZ)</span>
            <Landmark size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--amber-400)' }}>
            {pctGoverno.toFixed(1)}% (R$ {tributosFederaisEstaduaisMunicipais.toLocaleString('pt-BR')})
          </div>
          <div className="metric-sub">Carga Tributária Total Incidentes</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Acionistas (Lucros & JCP)</span>
            <PiggyBank size={18} color="var(--indigo-400)" />
          </div>
          <div className="metric-value font-mono" style={{ color: 'var(--indigo-400)' }}>
            {pctAcionistas.toFixed(1)}% (R$ {dividendosJcpRetidos.toLocaleString('pt-BR')})
          </div>
          <div className="metric-sub">Remuneração do Capital Próprio</div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="no-print panel-card">
        <div style={{ padding: '12px 0 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Parâmetros da Demonstração do Valor Adicionado (CPC 09)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>1. Vendas Brutas de Mercadorias e Serviços</label>
            <input
              type="number"
              step="50000"
              className="form-control font-mono"
              value={vendasBrutas}
              onChange={e => setVendasBrutas(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>2. Insumos Adquiridos de Terceiros (Custos)</label>
            <input
              type="number"
              step="20000"
              className="form-control font-mono"
              value={custosMateriasPrimasMercadorias}
              onChange={e => setCustosMateriasPrimasMercadorias(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>3. Materiais, Energia & Serviços de Terceiros</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={materiaisEnergiaServicosTerceiros}
              onChange={e => setMateriaisEnergiaServicosTerceiros(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>4. Depreciação e Amortização (CPC 27/04)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={depreciacaoAmortizacao}
              onChange={e => setDepreciacaoAmortizacao(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>5. Remuneração de Pessoal (Salários + FGTS)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={salariosBeneficiosFgts}
              onChange={e => setSalariosBeneficiosFgts(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>6. Tributos (Impostos, Taxas e Contribuições)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={tributosFederaisEstaduaisMunicipais}
              onChange={e => setTributosFederaisEstaduaisMunicipais(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>7. Remuneração de Capitais de Terceiros (Juros)</label>
            <input
              type="number"
              step="5000"
              className="form-control font-mono"
              value={jurosAlugueisTerceiros}
              onChange={e => setJurosAlugueisTerceiros(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>8. Remuneração dos Sócios (Lucros + JCP)</label>
            <input
              type="number"
              step="10000"
              className="form-control font-mono"
              value={dividendosJcpRetidos}
              onChange={e => setDividendosJcpRetidos(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* DOSSIÊ A4 */}
      <div className="diamond-paper-a4">
        <div className="diamond-header">
          <div>
            <div className="diamond-title">{currentTenant.name}</div>
            <div className="diamond-subtitle">DEMONSTRAÇÃO DO VALOR ADICIONADO (DVA - CPC 09 / NBC TG 09)</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.70rem' }}>
            <div>CNPJ: <strong>{currentTenant.cnpj}</strong></div>
            <div>EXERCÍCIO SOCIAL: <strong>{exercicio}</strong></div>
            <div style={{ color: '#047857', fontWeight: 800 }}>Conformidade IFRS / NBC TG</div>
          </div>
        </div>

        <table className="diamond-table">
          <thead>
            <tr>
              <th>Discriminação dos Elementos Formadores e Distribuição da Riqueza</th>
              <th style={{ textAlign: 'right' }}>Valor (R$)</th>
              <th style={{ textAlign: 'center' }}>% Part.</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>1 — RECEITAS</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>1.1) Vendas de Mercadorias, Produtos e Serviços</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {vendasBrutas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>1.2) Outras Receitas Operacionais</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {outrasReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>2 — INSUMOS ADQUIRIDOS DE TERCEIROS</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>2.1) Custos das Mercadorias e Matérias-Primas Consumidas</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {custosMateriasPrimasMercadorias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>2.2) Materiais, Energia, Serviços de Terceiros e Outros</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {materiaisEnergiaServicosTerceiros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr style={{ fontWeight: 800 }}>
              <td>3 — VALOR ADICIONADO BRUTO (1 - 2)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {valorAdicionadoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr>
              <td style={{ paddingLeft: '16px' }}>4 — RETENÇÕES: Depreciação, Amortização e Exaustão</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#B91C1C' }}>- R$ {depreciacaoAmortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr style={{ fontWeight: 800 }}>
              <td>5 — VALOR ADICIONADO LÍQUIDO PRODUZIDO PELA ENTIDADE (3 - 4)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>R$ {valorAdicionadoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr>
              <td style={{ paddingLeft: '16px' }}>6 — VALOR ADICIONADO RECEBIDO EM TRANSFERÊNCIA: Receitas Financeiras & MEP</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857' }}>+ R$ {receitasFinanceirasMep.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center' }}>-</td>
            </tr>

            <tr className="diamond-table-total">
              <td>7 — VALOR ADICIONADO TOTAL A DISTRIBUIR (5 + 6)</td>
              <td className="font-mono" style={{ textAlign: 'right', color: '#047857', fontWeight: 800 }}>R$ {valorAdicionadoTotalDistribuir.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 800 }}>100,0%</td>
            </tr>

            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td colSpan={3}>8 — DISTRIBUIÇÃO DO VALOR ADICIONADO</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>8.1) <strong>Pessoal:</strong> Remuneração Direta, Benefícios e FGTS</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {salariosBeneficiosFgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700 }} className="font-mono">{pctPessoal.toFixed(2)}%</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>8.2) <strong>Governo:</strong> Tributos Federais, Estaduais e Municipais</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {tributosFederaisEstaduaisMunicipais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700 }} className="font-mono">{pctGoverno.toFixed(2)}%</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>8.3) <strong>Remuneração de Capitais de Terceiros:</strong> Juros, Aluguéis e Financiamentos</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {jurosAlugueisTerceiros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700 }} className="font-mono">{pctTerceiros.toFixed(2)}%</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '16px' }}>8.4) <strong>Remuneração de Capitais Próprios:</strong> JCP, Dividendos e Lucros Retidos</td>
              <td className="font-mono" style={{ textAlign: 'right' }}>R$ {dividendosJcpRetidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'center', fontWeight: 700 }} className="font-mono">{pctAcionistas.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>

        <div className="diamond-signatures">
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">SUPERVISÃO DE DEMONSTRAÇÕES IFRS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>DVA CPC 09 / NBC TG 09</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">RESPONSÁVEL TÉCNICO CONTÁBIL</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>CRC/SP 1SP999999/O-0</div>
          </div>
          <div>
            <div style={{ height: '22px' }}></div>
            <div className="diamond-signature-line">DIRETORIA EXECUTIVA & ACIONISTAS</div>
            <div style={{ fontSize: '0.58rem', color: '#64748B' }}>Distribuição de Riqueza Aprovada</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DvaWealthJcpTaxView;
