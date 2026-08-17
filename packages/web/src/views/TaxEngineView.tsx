import { useState, useTransition } from 'react';
import {
  calculateSimplesNacional,
  calculateLucroPresumido,
  calculateLucroReal,
  calculateDualEngineReforma,
  calculateJcp,
  runComprehensiveTaxComparison,
  SimplesAnexo,
  TaxRegime
} from '@soberano/core';
import { Calculator, ArrowRightLeft, Sparkles, TrendingDown, DollarSign, Award } from 'lucide-react';

export const TaxEngineView = () => {
  const [activeTab, setActiveTab] = useState<'COMPARADOR' | 'REFORMA' | 'SIMPLES' | 'REAL_JCP'>('COMPARADOR');
  const [, startTransition] = useTransition();

  // Comparador 4 Regimes State
  const [compReceitaMes, setCompReceitaMes] = useState<number>(350000);
  const [compReceita12, setCompReceita12] = useState<number>(4200000);
  const [compFolhaMes, setCompFolhaMes] = useState<number>(70000);
  const [compFolha12, setCompFolha12] = useState<number>(840000);
  const [compCustoInsumos, setCompCustoInsumos] = useState<number>(140000);
  const [compDespesasOp, setCompDespesasOp] = useState<number>(50000);
  const [compAtividade, setCompAtividade] = useState<'COMERCIO' | 'SERVICOS' | 'INDUSTRIA' | 'TRANSPORTE'>('COMERCIO');

  // Reforma Dual-Engine State
  const [reformaValor, setReformaValor] = useState<number>(100000);
  const [reformaAno, setReformaAno] = useState<number>(2026);
  const [isDiferenciado, setIsDiferenciado] = useState<boolean>(false);
  const [isCestaBasica, setIsCestaBasica] = useState<boolean>(false);
  const [isSeletivo, setIsSeletivo] = useState<boolean>(false);
  const [regimeLegado, setRegimeLegado] = useState<TaxRegime>('LUCRO_PRESUMIDO');

  // Simples Nacional State
  const [simplesRbt12, setSimplesRbt12] = useState<number>(600000);
  const [simplesReceitaMes, setSimplesReceitaMes] = useState<number>(50000);
  const [simplesAnexo, setSimplesAnexo] = useState<SimplesAnexo>('ANEXO_I');
  const [simplesFolha12, setSimplesFolha12] = useState<number>(180000);

  // JCP State
  const [jcpPl, setJcpPl] = useState<number>(8000000);
  const [jcpTjlp, setJcpTjlp] = useState<number>(0.07);
  const [jcpLucro, setJcpLucro] = useState<number>(1500000);

  // Executa cálculos em tempo real
  const compResult = runComprehensiveTaxComparison({
    receitaBrutaMensal: compReceitaMes,
    receitaBruta12Meses: compReceita12,
    folhaSalariosMensal: compFolhaMes,
    folhaSalarios12Meses: compFolha12,
    custoInsumosMercadoriasMensal: compCustoInsumos,
    despesasOperacionaisMensal: compDespesasOp,
    tipoAtividade: compAtividade,
    ufOrigem: 'SP',
    ufDestino: 'RJ'
  });

  const reformaResult = calculateDualEngineReforma({
    anoSimulacao: reformaAno,
    valorOperacao: reformaValor,
    ufOrigem: 'SP',
    ufDestino: 'RJ',
    municipioDestinoIbge: '3304557',
    tipoItem: 'MERCADORIA',
    isRegimeDiferenciadoSaudeEducacao: isDiferenciado,
    isCestaBasicaNacional: isCestaBasica,
    isImpostoSeletivoIncidente: isSeletivo,
    regimeLegado
  });

  const simplesResult = calculateSimplesNacional({
    rbt12: simplesRbt12,
    receitaMes: simplesReceitaMes,
    anexo: simplesAnexo,
    folha12Meses: simplesFolha12
  });

  const jcpResult = calculateJcp({
    patrimonioLiquidoAjustado: jcpPl,
    taxaTjlpAnualPercent: jcpTjlp,
    mesesProporcional: 12,
    lucroExercicioAntesJcp: jcpLucro,
    lucrosAcumuladosEReservasDeLucros: 500000
  });

  return (
    <div>
      {/* Top Selector Tabs */}
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-${activeTab === 'COMPARADOR' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('COMPARADOR'))}
          >
            <TrendingDown size={16} /> Comparador 4 Regimes (Diagnóstico de Carga & ROI)
          </button>
          <button
            className={`btn-${activeTab === 'REFORMA' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('REFORMA'))}
          >
            <Sparkles size={16} /> Dual-Engine Reforma Tributária (EC 132/2023)
          </button>
          <button
            className={`btn-${activeTab === 'SIMPLES' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('SIMPLES'))}
          >
            <Calculator size={16} /> Simples Nacional & Fator R
          </button>
          <button
            className={`btn-${activeTab === 'REAL_JCP' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('REAL_JCP'))}
          >
            <DollarSign size={16} /> Lucro Real, LALUR & JCP
          </button>
        </div>
      </div>

      {/* TAB 1: COMPARADOR 4 REGIMES */}
      {activeTab === 'COMPARADOR' && compResult.success && (
        <div>
          <div className="panel-card">
            <div className="panel-title-bar">
              <h2><Award size={20} color="var(--emerald-500)" /> Diagnóstico Comparativo Estratégico Tributário</h2>
              <span className="badge badge-emerald">Melhor Opção: {compResult.data.regimeMaisEconomico}</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Receita Bruta do Mês (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={compReceitaMes}
                  onChange={(e) => setCompReceitaMes(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Receita Bruta 12 Meses (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={compReceita12}
                  onChange={(e) => setCompReceita12(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Folha de Salários do Mês (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={compFolhaMes}
                  onChange={(e) => setCompFolhaMes(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Custo Insumos / Mercadorias Mês (R$)</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={compCustoInsumos}
                  onChange={(e) => setCompCustoInsumos(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Atividade Econômica</label>
                <select
                  className="form-control"
                  value={compAtividade}
                  onChange={(e) => setCompAtividade(e.target.value as any)}
                >
                  <option value="COMERCIO">Comércio Varejista/Atacadista</option>
                  <option value="INDUSTRIA">Indústria e Manufatura</option>
                  <option value="SERVICOS">Prestação de Serviços em Geral</option>
                  <option value="TRANSPORTE">Transporte Rodoviário de Cargas</option>
                </select>
              </div>
            </div>

            {/* Strategic Diagnostic Banner */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--emerald-500)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <Award size={20} color="var(--emerald-400)" />
                <h4 style={{ color: '#fff', fontWeight: 800 }}>Recomendação Fiscal: {compResult.data.regimeMaisEconomico}</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{compResult.data.diagnosticoEstrategico}</p>
              <div style={{ marginTop: '0.5rem', fontWeight: 700, color: 'var(--emerald-400)', fontSize: '0.95rem' }}>
                Economia Anual Estimada vs Pior Cenário: R$ {compResult.data.economiaAnualEstimadaVsPiorCenario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* 4 Regimes Cards */}
            <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
              <div className={`metric-card ${compResult.data.regimeMaisEconomico === 'SIMPLES_NACIONAL' ? 'highlight' : ''}`}>
                <div className="metric-header">
                  <span className="metric-title">Simples Nacional</span>
                  {compResult.data.simplesNacional.elegivel ? <span className="badge badge-emerald">Elegível</span> : <span className="badge badge-rose">Inelegível</span>}
                </div>
                <div className="metric-value font-mono">
                  {compResult.data.simplesNacional.elegivel ? `R$ ${compResult.data.simplesNacional.impostoTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                </div>
                <div className="metric-sub">
                  Alíquota Efetiva: {compResult.data.simplesNacional.aliquotaEfetivaPercent}%
                </div>
              </div>

              <div className={`metric-card ${compResult.data.regimeMaisEconomico === 'LUCRO_PRESUMIDO' ? 'highlight' : ''}`}>
                <div className="metric-header">
                  <span className="metric-title">Lucro Presumido</span>
                  <span className="badge badge-cyan">Trimestral</span>
                </div>
                <div className="metric-value font-mono">
                  R$ {compResult.data.lucroPresumido.impostoTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="metric-sub">
                  Alíquota Efetiva: {compResult.data.lucroPresumido.aliquotaEfetivaPercent}%
                </div>
              </div>

              <div className={`metric-card ${compResult.data.regimeMaisEconomico === 'LUCRO_REAL' ? 'highlight' : ''}`}>
                <div className="metric-header">
                  <span className="metric-title">Lucro Real</span>
                  <span className="badge badge-indigo">Não-Cumulativo</span>
                </div>
                <div className="metric-value font-mono">
                  R$ {compResult.data.lucroReal.impostoTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="metric-sub">
                  Alíquota Efetiva: {compResult.data.lucroReal.aliquotaEfetivaPercent}%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Reforma 2026 (CBS+IBS)</span>
                  <span className="badge badge-amber">Ano-Teste</span>
                </div>
                <div className="metric-value font-mono">
                  R$ {compResult.data.reformaEc132Ano2026.impostoTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="metric-sub">
                  Split Payment: R$ {compResult.data.reformaEc132Ano2026.splitPaymentRetido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REFORMA EC 132/2023 */}
      {activeTab === 'REFORMA' && reformaResult.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><ArrowRightLeft size={20} color="var(--emerald-500)" /> Dual-Engine da Reforma Tributária (EC 132/2023)</h2>
            <span className="badge badge-indigo">Transição 2026 - 2033</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Valor da Operação (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={reformaValor}
                onChange={(e) => setReformaValor(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Ano de Vigência da Simulação</label>
              <select
                className="form-control"
                value={reformaAno}
                onChange={(e) => setReformaAno(Number(e.target.value))}
              >
                <option value={2026}>2026 (Ano-Teste: CBS 0,9% / IBS 0,1%)</option>
                <option value={2027}>2027 (Entrada CBS Plena / Extinção PIS/COFINS)</option>
                <option value={2029}>2029 (Início Redução ICMS/ISS 25%)</option>
                <option value={2030}>2030 (Transição ICMS/ISS 50%)</option>
                <option value={2031}>2031 (Transição ICMS/ISS 75%)</option>
                <option value={2033}>2033 (Modelo Definitivo Pleno)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Regime Legado para Comparação</label>
              <select
                className="form-control"
                value={regimeLegado}
                onChange={(e) => setRegimeLegado(e.target.value as TaxRegime)}
              >
                <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                <option value="LUCRO_REAL_TRIMESTRAL">Lucro Real (Não-Cumulativo)</option>
                <option value="SIMPLES_NACIONAL">Simples Nacional</option>
              </select>
            </div>
          </div>

          <div className="comparison-grid" style={{ marginTop: '1.5rem' }}>
            <div className="comparison-box highlight">
              <h3 style={{ color: 'var(--emerald-400)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Novo Modelo: CBS + IBS + IS (EC 132/2023)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>CBS (Federal):</span>
                  <span className="font-mono">R$ {reformaResult.data.novoModelo.valorCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>IBS (Estadual/Municipal):</span>
                  <span className="font-mono">R$ {reformaResult.data.novoModelo.valorIbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  <span>Total Tributos Novos:</span>
                  <span className="font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {reformaResult.data.novoModelo.totalTributosNovos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="comparison-box">
              <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Modelo Legado ({regimeLegado})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>PIS + COFINS:</span>
                  <span className="font-mono">R$ {(reformaResult.data.modeloLegado.pis + reformaResult.data.modeloLegado.cofins).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>ICMS / ISS:</span>
                  <span className="font-mono">R$ {reformaResult.data.modeloLegado.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  <span>Total Tributos Legado:</span>
                  <span className="font-mono">R$ {reformaResult.data.modeloLegado.totalTributosLegado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIMPLES NACIONAL */}
      {activeTab === 'SIMPLES' && simplesResult.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Calculator size={20} color="var(--emerald-500)" /> Motor de Apuração Simples Nacional (DAS)</h2>
            <span className="badge badge-emerald">LC 123/2006</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Receita Bruta 12 Meses (RBT12)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={simplesRbt12}
                onChange={(e) => setSimplesRbt12(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Receita do Mês Corrente</label>
              <input
                type="number"
                className="form-control font-mono"
                value={simplesReceitaMes}
                onChange={(e) => setSimplesReceitaMes(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Enquadramento de Atividade</label>
              <select
                className="form-control"
                value={simplesAnexo}
                onChange={(e) => setSimplesAnexo(e.target.value as SimplesAnexo)}
              >
                <option value="ANEXO_I">Anexo I - Comércio</option>
                <option value="ANEXO_II">Anexo II - Indústria</option>
                <option value="ANEXO_III">Anexo III - Serviços Regra Geral</option>
                <option value="ANEXO_IV">Anexo IV - Advocacia / Construção</option>
                <option value="ANEXO_V">Anexo V - Tecnologia / Intelectuais (Fator R)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Folha de Salários 12 Meses (Fator R)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={simplesFolha12}
                onChange={(e) => setSimplesFolha12(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Faixa</span></div>
              <div className="metric-value font-mono">Faixa {simplesResult.data.faixa}</div>
              <div className="metric-sub">Alíquota: {(simplesResult.data.aliquotaNominal * 100).toFixed(2)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Alíquota Efetiva</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>{(simplesResult.data.aliquotaEfetiva * 100).toFixed(2)}%</div>
              <div className="metric-sub">Dedução: R$ {simplesResult.data.parcelaADeduzir.toLocaleString('pt-BR')}</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Fator R</span></div>
              <div className="metric-value font-mono">{simplesResult.data.fatorR !== undefined ? (simplesResult.data.fatorR * 100).toFixed(1) + '%' : 'N/A'}</div>
              <div className="metric-sub">Anexo: {simplesResult.data.anexoAplicado}</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Guia DAS a Recolher</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {simplesResult.data.valorDevidoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Vencimento: dia 20</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LUCRO REAL & JCP */}
      {activeTab === 'REAL_JCP' && jcpResult.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><DollarSign size={20} color="var(--indigo-500)" /> Otimização Tributária: Juros sobre Capital Próprio (JCP)</h2>
            <span className="badge badge-indigo">Art. 9º Lei 9.249/95</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Patrimônio Líquido Ajustado (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={jcpPl}
                onChange={(e) => setJcpPl(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Taxa TJLP Anual (Ex: 0.07 para 7%)</label>
              <input
                type="number"
                step="0.005"
                className="form-control font-mono"
                value={jcpTjlp}
                onChange={(e) => setJcpTjlp(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Lucro do Exercício antes do JCP (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={jcpLucro}
                onChange={(e) => setJcpLucro(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">JCP Máximo Dedutível</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {jcpResult.data.valorMaximoJcpDedutivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Limite TJLP sobre PL</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">IRRF Retido 15%</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--rose-500)' }}>R$ {jcpResult.data.irrfRetidoNaFonte15Percent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Exclusivo na Fonte</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Economia IRPJ/CSLL 34%</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {jcpResult.data.economiaTributariaIrpjCsll34Percent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Dedução na PJ</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Ganho Líquido aos Sócios</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--cyan-500)' }}>R$ {jcpResult.data.vantagemFinanceiraLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Economia Fiscal Líquida</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
