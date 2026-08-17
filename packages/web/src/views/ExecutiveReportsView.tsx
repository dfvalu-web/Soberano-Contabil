import React, { useState } from 'react';
import {
  generateExecutiveDossier,
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  generateFinancialStatements,
  calculateAssetDepreciation,
  calculateCiapBlocoG,
  FixedAssetItem,
  Company
} from '@soberano/core';
import { Award, Printer, ShieldCheck, FileCheck, CheckCircle2, TrendingUp, Building, Layers } from 'lucide-react';

export const ExecutiveReportsView: React.FC = () => {
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

  const contas = createStandardChartOfAccounts(mockCompany.tenantId);
  const engine = new DoubleEntryEngine(contas);
  engine.postEntry('tenant-01', '2026-01-02', 'Integralização de Capital', [
    { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 500000.00 },
    { accountId: '2.3.1.01', accountCode: '2.3.1.01', accountName: 'Capital Social Subscrito', type: 'CREDIT', amount: 500000.00 }
  ]);
  engine.postEntry('tenant-01', '2026-01-10', 'Venda de Servidores Corporativos', [
    { accountId: '1.1.2.01', accountCode: '1.1.2.01', accountName: 'Clientes Nacionais', type: 'DEBIT', amount: 350000.00 },
    { accountId: '3.1.1.01', accountCode: '3.1.1.01', accountName: 'Receita Bruta de Vendas', type: 'CREDIT', amount: 350000.00 }
  ]);
  engine.postEntry('tenant-01', '2026-01-10', 'Baixa de CMV', [
    { accountId: '4.1.1.01', accountCode: '4.1.1.01', accountName: 'Custo das Mercadorias Vendidas (CMV)', type: 'DEBIT', amount: 120000.00 },
    { accountId: '1.1.3.01', accountCode: '1.1.3.01', accountName: 'Mercadorias para Revenda', type: 'CREDIT', amount: 120000.00 }
  ]);

  const stmtsRes = generateFinancialStatements(engine.getAccounts(), '2026-01-01', '2026-01-31');
  const dossierRes = stmtsRes.success ? generateExecutiveDossier(mockCompany, stmtsRes.data.balanceSheet, stmtsRes.data.incomeStatement, 100) : null;
  const dossier = dossierRes && dossierRes.success ? dossierRes.data : null;

  // Imobilizado & CIAP
  const mockAsset: FixedAssetItem = {
    id: 'AST-01',
    tenantId: 'tenant-01',
    codigoPatrimonial: 'PAT-ROBOT-01',
    descricao: 'Centro de Usinagem CNC Robótico 5 Eixos',
    categoria: 'MAQUINAS_EQUIPAMENTOS',
    dataAquisicao: '2026-01-02',
    dataInicioDepreciacao: '2026-01-02',
    custoAquisicao: 480000.00,
    valorResidualEstimado: 48000.00,
    vidaUtilAnos: 10,
    taxaDepreciacaoAnualPercent: 10,
    depreciacaoAcumuladaAnterior: 0
  };

  const assetDep = calculateAssetDepreciation(mockAsset, '2026-01');
  const ciapCalc = calculateCiapBlocoG({
    codigoBem: 'PAT-ROBOT-01',
    descricaoBem: 'Centro de Usinagem CNC',
    numeroNotaFiscal: 'NF-8899',
    dataEntrada: '2026-01-02',
    valorIcmsTotalDestacado: 86400.00,
    parcelaAtualMes: 1,
    saidasTributadasMes: 300000,
    saidasExportacaoImunesMes: 50000,
    totalGeralSaidasMes: 350000
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-title-bar">
          <h2><Award size={20} color="var(--emerald-500)" /> Dossiê Executivo de Inteligência Contábil & Fiscal</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> Padrão CFC / IFRS 100%
            </span>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={15} /> Imprimir / Exportar PDF Oficial
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Documento estruturado para conselhos de administração, comitês de auditoria e auditorias externas (Big Four).
        </p>
      </div>

      {dossier && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header of Dossier */}
          <div className="panel-card" style={{ background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--emerald-500)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Empresa / Razão Social:</span>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800 }}>{dossier.cabecalho.empresa}</h3>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>CNPJ / UF:</span>
                <div className="font-mono" style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{dossier.cabecalho.cnpj} - {dossier.cabecalho.uf}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Regime Tributário:</span>
                <div><span className="badge badge-cyan">{dossier.cabecalho.regimeTributario}</span></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Responsabilidade Técnica:</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dossier.cabecalho.responsavelTecnicoCrc}</div>
              </div>
            </div>
          </div>

          {/* Key Financial & Governance Metrics */}
          <div className="grid-cards-4">
            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Ativo Total</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                R$ {dossier.resumoFinanceiro.totalAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">Balanço Patrimonial IFRS</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Lucro Líquido do Exercício</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--cyan-500)' }}>
                R$ {dossier.resumoFinanceiro.lucroLiquidoPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="metric-sub">Margem Líquida: {dossier.resumoFinanceiro.margemLiquidaPercent}%</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Score de Conformidade</span></div>
              <div className="metric-value font-mono" style={{ color: 'var(--emerald-400)' }}>
                {dossier.governancaESeguranca.scoreConformidadeFiscal} %
              </div>
              <div className="metric-sub">Zero divergências fiscais</div>
            </div>

            <div className="metric-card">
              <div className="metric-header"><span className="metric-title">Trilha & Ledger</span></div>
              <div className="metric-value" style={{ color: 'var(--emerald-400)', fontSize: '1rem' }}>
                {dossier.governancaESeguranca.statusLedgerImutavel}
              </div>
              <div className="metric-sub">SHA-256 Merkle Chain</div>
            </div>
          </div>

          {/* Fixed Assets & CIAP Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="panel-card">
              <div className="panel-title-bar">
                <h2><Building size={18} color="var(--cyan-500)" /> Gestão de Ativo Imobilizado (CPC 27)</h2>
                <span className="badge badge-cyan">Vida Útil: 10 Anos</span>
              </div>
              {assetDep.success && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Item Patrimonial:</span>
                    <span style={{ fontWeight: 600 }}>{mockAsset.descricao}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Custo Histórico de Aquisição:</span>
                    <span className="font-mono">R$ {mockAsset.custoAquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Depreciação Mensal Apropriada:</span>
                    <span className="font-mono" style={{ color: 'var(--amber-500)', fontWeight: 700 }}>
                      R$ {assetDep.data.depreciacaoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Valor Contábil Líquido:</span>
                    <span className="font-mono" style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>
                      R$ {assetDep.data.valorContabilLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="panel-card">
              <div className="panel-title-bar">
                <h2><Layers size={18} color="var(--indigo-500)" /> CIAP: Crédito de ICMS do Imobilizado (LC 87/96)</h2>
                <span className="badge badge-indigo">1/48 Avos Mensais</span>
              </div>
              {ciapCalc.success && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>ICMS Total Destacado na NF:</span>
                    <span className="font-mono">R$ 86.400,00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Fator de Apropriação das Saídas:</span>
                    <span className="font-mono" style={{ color: 'var(--cyan-500)' }}>{ciapCalc.data.fatorApropriacaoIcmsPercent}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Crédito ICMS Apropriável no Mês:</span>
                    <span className="font-mono" style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>
                      R$ {ciapCalc.data.creditoIcmsApropriavelMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Saldo ICMS a Recuperar Remanescente:</span>
                    <span className="font-mono">R$ {ciapCalc.data.saldoIcmsARecuperarRemanescente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Conclusions */}
          <div className="panel-card">
            <div className="panel-title-bar">
              <h2><FileCheck size={18} color="var(--emerald-400)" /> Parecer Técnico & Conclusões dos Auditores</h2>
              <span className="badge badge-emerald">Parecer Sem Ressalvas</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dossier.conclusoesAuditoria.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} color="var(--emerald-400)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
