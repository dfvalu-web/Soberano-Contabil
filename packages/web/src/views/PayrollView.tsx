import { useState, useTransition } from 'react';
import {
  calculateMonthlyPayroll,
  calculateTermination,
  calculateVacations,
  calculateThirteenthSalary,
  calculateMonthlyProvisions,
  generateEsocialS1000Xml,
  generateEsocialS1200Xml,
  generateEsocialS1299Xml,
  Company
} from '@soberano/core';
import { Users, UserMinus, Calendar, Gift, DollarSign, Send, FileCode } from 'lucide-react';

export const PayrollView = () => {
  const [activeTab, setActiveTab] = useState<'MONTHLY' | 'VACATIONS' | 'THIRTEENTH' | 'PROVISIONS' | 'TERMINATION' | 'ESOCIAL'>('MONTHLY');
  const [, startTransition] = useTransition();

  // Monthly State
  const [salarioBase, setSalarioBase] = useState<number>(5500);
  const [dependentes, setDependentes] = useState<number>(1);
  const [horasExtras50, setHorasExtras50] = useState<number>(10);
  const [adicionalPericulosidade, setAdicionalPericulosidade] = useState<boolean>(false);

  // Vacations State
  const [feriasSalario, setFeriasSalario] = useState<number>(6000);
  const [diasGozo, setDiasGozo] = useState<number>(20);
  const [diasAbono, setDiasAbono] = useState<number>(10);

  // 13th State
  const [decimoSalario, setDecimoSalario] = useState<number>(6000);
  const [decimoParcela, setDecimoParcela] = useState<'PRIMEIRA' | 'SEGUNDA'>('PRIMEIRA');

  // Provisions State
  const [folhaBrutaEmpresa, setFolhaBrutaEmpresa] = useState<number>(150000);

  // Termination State
  const [termSalario, setTermSalario] = useState<number>(5000);
  const [termTipo, setTermTipo] = useState<any>('DEMISSAO_SEM_JUSTA_CAUSA');
  const [termSaldoFgts, setTermSaldoFgts] = useState<number>(12000);
  const [termDiasSaldo, setTermDiasSaldo] = useState<number>(15);

  const mockCompany: Company = {
    id: 'comp-01',
    tenantId: 'tenant-01',
    cnpj: '12345678000195',
    razaoSocial: 'SOBERANO INDUSTRIA E TECNOLOGIA S/A',
    nomeFantasia: 'Soberano Indústria',
    cnaePrincipal: '2621300',
    cnaesSecundarios: [],
    regimeTributario: 'LUCRO_REAL_TRIMESTRAL',
    uf: 'SP',
    codigoMunicipioIbge: '3550308',
    aliquotaIssMunicipal: 0.05,
    fatorRElegivel: false,
    optanteSimples: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const folhaRes = calculateMonthlyPayroll({
    salarioBase,
    dependentesIrrf: dependentes,
    horasExtras50Percent: horasExtras50,
    adicionalPericulosidade
  });

  const feriasRes = calculateVacations({
    salarioBase: feriasSalario,
    diasGozoFerias: diasGozo,
    diasAbonoPecuniario: diasAbono,
    dependentesIrrf: 1
  });

  const decimoRes = calculateThirteenthSalary({
    salarioBase: decimoSalario,
    mesesTrabalhadosNoAno: 12,
    parcela: decimoParcela,
    valorPagoPrimeiraParcela: decimoSalario / 2
  });

  const provRes = calculateMonthlyProvisions({
    folhaBrutaMensal: folhaBrutaEmpresa
  });

  const termRes = calculateTermination({
    tipo: termTipo,
    dataAdmissao: '2023-06-01',
    dataDemissao: '2026-02-01',
    salarioBase: termSalario,
    motivoAvisoPrevio: 'INDENIZADO',
    saldoFgtsAcumulado: termSaldoFgts,
    mesesTrabalhadosAnoCorrente: 2,
    diasSaldoSalario: termDiasSaldo,
    feriasVencidas: false
  });

  const s1000Xml = generateEsocialS1000Xml(mockCompany);
  const s1200Xml = generateEsocialS1200Xml(mockCompany, '12345678901', 'MATR-001', '2026-01', salarioBase, 550);
  const s1299Xml = generateEsocialS1299Xml(mockCompany, '2026-01');

  return (
    <div>
      {/* Subtab Selector */}
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-${activeTab === 'MONTHLY' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('MONTHLY'))}
          >
            <Users size={16} /> Folha Mensal
          </button>
          <button
            className={`btn-${activeTab === 'VACATIONS' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('VACATIONS'))}
          >
            <Calendar size={16} /> Férias & Abono
          </button>
          <button
            className={`btn-${activeTab === 'THIRTEENTH' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('THIRTEENTH'))}
          >
            <Gift size={16} /> 13º Salário
          </button>
          <button
            className={`btn-${activeTab === 'PROVISIONS' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('PROVISIONS'))}
          >
            <DollarSign size={16} /> Provisões Contábeis
          </button>
          <button
            className={`btn-${activeTab === 'TERMINATION' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('TERMINATION'))}
          >
            <UserMinus size={16} /> Rescisões CLT
          </button>
          <button
            className={`btn-${activeTab === 'ESOCIAL' ? 'primary' : 'secondary'}`}
            onClick={() => startTransition(() => setActiveTab('ESOCIAL'))}
          >
            <Send size={16} /> Mensageria eSocial
          </button>
        </div>
      </div>

      {/* MONTHLY */}
      {activeTab === 'MONTHLY' && folhaRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Users size={20} color="var(--emerald-500)" /> Apuração da Folha Mensal (INSS & IRRF 2026)</h2>
            <span className="badge badge-emerald">eSocial S-1200</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Salário Base Contratual (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={salarioBase}
                onChange={(e) => setSalarioBase(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Número de Dependentes</label>
              <input
                type="number"
                className="form-control font-mono"
                value={dependentes}
                onChange={(e) => setDependentes(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Horas Extras 50%</label>
              <input
                type="number"
                className="form-control font-mono"
                value={horasExtras50}
                onChange={(e) => setHorasExtras50(Number(e.target.value))}
              />
            </div>
            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  checked={adicionalPericulosidade}
                  onChange={(e) => setAdicionalPericulosidade(e.target.checked)}
                />
                Adicional de Periculosidade (30%)
              </label>
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Salário Bruto Total</span></div>
              <div className="metric-value font-mono">R$ {folhaRes.data.proventos.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Base INSS/FGTS</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">INSS Progressivo</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--rose-500)' }}>R$ {folhaRes.data.descontos.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Alíquota Efetiva: {folhaRes.data.descontos.aliquotaEfetivaInss}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">IRRF Retido</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--rose-500)' }}>R$ {folhaRes.data.descontos.irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">{folhaRes.data.descontos.usaDeducaoSimplificadaIrrf ? 'Dedução Simplificada' : 'Dedução Legal'}</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Líquido a Pagar</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {folhaRes.data.salarioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Custo Empresa: R$ {folhaRes.data.encargosPatronais.custoTotalEmpregador.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      )}

      {/* VACATIONS */}
      {activeTab === 'VACATIONS' && feriasRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Calendar size={20} color="var(--cyan-500)" /> Recibo de Férias & Abono Pecuniário (CLT Art. 143)</h2>
            <span className="badge badge-cyan">1/3 Constitucional</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Salário Base (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={feriasSalario}
                onChange={(e) => setFeriasSalario(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Dias de Gozo de Férias</label>
              <input
                type="number"
                className="form-control font-mono"
                value={diasGozo}
                onChange={(e) => setDiasGozo(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Dias de Abono Pecuniário (Venda)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={diasAbono}
                onChange={(e) => setDiasAbono(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Férias Gozadas + 1/3</span></div>
              <div className="metric-value font-mono">R$ {(feriasRes.data.valorDiasFerias + feriasRes.data.tercoConstitucional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Base Tributável INSS/IRRF</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Abono Pecuniário + 1/3</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--cyan-500)' }}>R$ {(feriasRes.data.valorAbonoPecuniario + feriasRes.data.tercoAbonoPecuniario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Isento de INSS / IRRF</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Descontos INSS + IRRF</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--rose-500)' }}>R$ {(feriasRes.data.descontoInss + feriasRes.data.descontoIrrf).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Retenções Legais</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Líquido de Férias</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {feriasRes.data.liquidoFeriasAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Pagamento até 2 dias antes</div>
            </div>
          </div>
        </div>
      )}

      {/* THIRTEENTH */}
      {activeTab === 'THIRTEENTH' && decimoRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Gift size={20} color="var(--indigo-500)" /> 13º Salário (Gratificação Natalina)</h2>
            <span className="badge badge-indigo">Lei 4.090/62</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Salário Base (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={decimoSalario}
                onChange={(e) => setDecimoSalario(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Parcela</label>
              <select
                className="form-control"
                value={decimoParcela}
                onChange={(e) => setDecimoParcela(e.target.value as any)}
              >
                <option value="PRIMEIRA">1ª Parcela (50% sem descontos até 30/11)</option>
                <option value="SEGUNDA">2ª Parcela (Integral com descontos até 20/12)</option>
              </select>
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Valor Bruto Parcela</span></div>
              <div className="metric-value font-mono">R$ {decimoRes.data.valorBrutoParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Base de Cálculo</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Desconto 1ª Parcela</span></div>
              <div className="metric-value font-mono">R$ {decimoRes.data.descontoAdiantamentoPrimeiraParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Adiantamento já pago</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">INSS + IRRF 13º</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--rose-500)' }}>R$ {(decimoRes.data.descontoInss + decimoRes.data.descontoIrrf).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Tributação Exclusiva</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Líquido a Pagar</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {decimoRes.data.liquidoAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Crédito bancário</div>
            </div>
          </div>
        </div>
      )}

      {/* PROVISIONS */}
      {activeTab === 'PROVISIONS' && provRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><DollarSign size={20} color="var(--emerald-500)" /> Provisões Mensais Contábeis (Férias e 13º Salário)</h2>
            <span className="badge badge-emerald">Encargos Patronais: 35,8%</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Folha Bruta Total da Empresa no Mês (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={folhaBrutaEmpresa}
                onChange={(e) => setFolhaBrutaEmpresa(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Provisão Férias + 1/3</span></div>
              <div className="metric-value font-mono">R$ {provRes.data.provisaoFeriasPrincipal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">1/12 avos + terço constitucional</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Encargos s/ Férias</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--amber-500)' }}>R$ {provRes.data.provisaoFeriasEncargosPatronais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">INSS 20% + RAT + FGTS 8% + Terceiros</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Provisão 13º Salário</span></div>
              <div className="metric-value font-mono">R$ {provRes.data.provisaoDecimoTerceiroPrincipal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">1/12 avos mensais</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Total Provisão Mensal</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {provRes.data.totalProvisoesDoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Lançamento D: Despesa / C: Passivo</div>
            </div>
          </div>
        </div>
      )}

      {/* TERMINATION */}
      {activeTab === 'TERMINATION' && termRes.success && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><UserMinus size={20} color="var(--amber-500)" /> Rescisão Trabalhista & FGTS Digital</h2>
            <span className="badge badge-amber">eSocial S-2299</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Modalidade de Rescisão</label>
              <select
                className="form-control"
                value={termTipo}
                onChange={(e) => setTermTipo(e.target.value)}
              >
                <option value="DEMISSAO_SEM_JUSTA_CAUSA">Demissão sem Justa Causa (Multa FGTS 40%)</option>
                <option value="ACORDO_MUTUO_ART_484_A">Acordo Mútuo - Art. 484-A CLT (Multa FGTS 20%)</option>
                <option value="PEDIDO_DEMISSAO">Pedido de Demissão pelo Empregado</option>
                <option value="DEMISSAO_COM_JUSTA_CAUSA">Demissão por Justa Causa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Salário Base (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={termSalario}
                onChange={(e) => setTermSalario(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Saldo de FGTS Acumulado (R$)</label>
              <input
                type="number"
                className="form-control font-mono"
                value={termSaldoFgts}
                onChange={(e) => setTermSaldoFgts(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Dias de Saldo de Salário no Mês</label>
              <input
                type="number"
                className="form-control font-mono"
                value={termDiasSaldo}
                onChange={(e) => setTermDiasSaldo(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid-cards-4" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Total Bruto Rescisório</span></div>
              <div className="metric-value font-mono">R$ {termRes.data.verbasRescisorias.totalBrutoRescisao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Aviso: {termRes.data.diasAvisoPrevioTotal} dias</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Multa Rescisória FGTS</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--amber-500)' }}>R$ {termRes.data.fgts.multaRescisoriaFgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">{termRes.data.fgts.percentualMulta}% sobre saldo FGTS</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Líquido a Pagar</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>R$ {termRes.data.liquidoRescisao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="metric-sub">Pagamento em até 10 dias</div>
            </div>
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Saque FGTS</span></div>
              <div className="metric-value font-mono" style={{ color: termRes.data.fgts.permiteSeguroDesemprego ? 'var(--emerald-400)' : 'var(--rose-500)' }}>
                R$ {termRes.data.fgts.saldoFgtsLiberadoSaque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">{termRes.data.fgts.permiteSeguroDesemprego ? 'Seguro-Desemprego Liberado' : 'Sem Seguro-Desemprego'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ESOCIAL */}
      {activeTab === 'ESOCIAL' && (
        <div className="panel-card">
          <div className="panel-title-bar">
            <h2><Send size={20} color="var(--indigo-500)" /> Mensageria eSocial Nativa (Eventos S-1000, S-1200 e S-1299)</h2>
            <span className="badge badge-emerald">Layout S-1.2 Oficial</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: 'var(--cyan-500)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>Evento S-1000: Informações do Empregador</h4>
              <textarea
                className="form-control font-mono"
                style={{ width: '100%', height: '140px', fontSize: '0.75rem', background: 'var(--bg-surface-elevated)' }}
                value={s1000Xml}
                readOnly
              />
            </div>
            <div>
              <h4 style={{ color: 'var(--emerald-400)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>Evento S-1200: Remuneração do Trabalhador</h4>
              <textarea
                className="form-control font-mono"
                style={{ width: '100%', height: '140px', fontSize: '0.75rem', background: 'var(--bg-surface-elevated)' }}
                value={s1200Xml}
                readOnly
              />
            </div>
            <div>
              <h4 style={{ color: 'var(--amber-500)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>Evento S-1299: Fechamento Periódico e Envio DCTFWeb</h4>
              <textarea
                className="form-control font-mono"
                style={{ width: '100%', height: '140px', fontSize: '0.75rem', background: 'var(--bg-surface-elevated)' }}
                value={s1299Xml}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
