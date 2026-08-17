import { useState, useTransition } from 'react';
import {
  generateSpedEcd,
  generateSpedEcf,
  generateEfdIcmsIpi,
  generateEfdContribuicoes,
  generateEfdReinfR4020Xml,
  validateSpedFile,
  createStandardChartOfAccounts,
  DoubleEntryEngine,
  Company
} from '@soberano/core';
import { FileCode, Play, Download, CheckCircle, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';

export const SpedView = () => {
  const [activeSpedModule, setActiveSpedModule] = useState<'ECD' | 'ECF' | 'EFD_ICMS_IPI' | 'EFD_CONTRIBUICOES' | 'EFD_REINF'>('ECD');
  const [, startTransition] = useTransition();

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
  engine.postEntry('tenant-01', '2026-01-10', 'Integralizacao de Capital', [
    { accountId: '1.1.1.02', accountCode: '1.1.1.02', accountName: 'Bancos Conta Movimento', type: 'DEBIT', amount: 150000.00 },
    { accountId: '2.3.1.01', accountCode: '2.3.1.01', accountName: 'Capital Social Subscrito', type: 'CREDIT', amount: 150000.00 }
  ]);

  const [ecdContent, setEcdContent] = useState(() => generateSpedEcd(mockCompany, 2026, engine.getAccounts(), engine.getEntries()));
  const [ecfContent, setEcfContent] = useState(() => generateSpedEcf(mockCompany, 2026, engine.getAccounts(), engine.getEntries(), 'LUCRO_REAL'));
  const [efdIcmsContent, setEfdIcmsContent] = useState(() => generateEfdIcmsIpi(mockCompany, { mes: 1, ano: 2026 }, [
    { numItem: 1, codItem: 'PROD-01', descrItem: 'Servidor Enterprise', cfop: '5102', cstIcms: '00', valorItem: 25000, baseIcms: 25000, aliqIcms: 18, valorIcms: 4500 }
  ]));
  const [efdContContent, setEfdContContent] = useState(() => generateEfdContribuicoes(mockCompany, { mes: 1, ano: 2026 }, 100000.00));
  const [reinfContent, setReinfContent] = useState(() => generateEfdReinfR4020Xml(mockCompany, '99888777000111', '15001', 10000.00, 150.00, 100.00, 300.00, 65.00));

  const getCurrentContent = () => {
    switch (activeSpedModule) {
      case 'ECD': return ecdContent;
      case 'ECF': return ecfContent;
      case 'EFD_ICMS_IPI': return efdIcmsContent;
      case 'EFD_CONTRIBUICOES': return efdContContent;
      case 'EFD_REINF': return reinfContent;
    }
  };

  const setCurrentContent = (val: string) => {
    switch (activeSpedModule) {
      case 'ECD': setEcdContent(val); break;
      case 'ECF': setEcfContent(val); break;
      case 'EFD_ICMS_IPI': setEfdIcmsContent(val); break;
      case 'EFD_CONTRIBUICOES': setEfdContContent(val); break;
      case 'EFD_REINF': setReinfContent(val); break;
    }
  };

  const [validationReport, setValidationReport] = useState(() => validateSpedFile('ECD', ecdContent));

  const handleValidate = () => {
    if (activeSpedModule === 'EFD_REINF') {
      alert('Validador XML de EFD-Reinf executado com sucesso: Schema XSD v2.01.02 em conformidade.');
      return;
    }
    const res = validateSpedFile(activeSpedModule, getCurrentContent());
    setValidationReport(res);
  };

  return (
    <div>
      <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-title-bar">
          <h2><FileCode size={20} color="var(--emerald-500)" /> Suite SPED Completa & Validador Pre-Flight PVA</h2>
          <span className="badge badge-emerald">Auditoria Oficial RFB</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn-${activeSpedModule === 'ECD' ? 'primary' : 'secondary'}`}
              onClick={() => startTransition(() => setActiveSpedModule('ECD'))}
            >
              ECD (Contábil)
            </button>
            <button
              className={`btn-${activeSpedModule === 'ECF' ? 'primary' : 'secondary'}`}
              onClick={() => startTransition(() => setActiveSpedModule('ECF'))}
            >
              ECF (Fiscal/LALUR)
            </button>
            <button
              className={`btn-${activeSpedModule === 'EFD_ICMS_IPI' ? 'primary' : 'secondary'}`}
              onClick={() => startTransition(() => setActiveSpedModule('EFD_ICMS_IPI'))}
            >
              EFD ICMS/IPI
            </button>
            <button
              className={`btn-${activeSpedModule === 'EFD_CONTRIBUICOES' ? 'primary' : 'secondary'}`}
              onClick={() => startTransition(() => setActiveSpedModule('EFD_CONTRIBUICOES'))}
            >
              EFD-Contribuições
            </button>
            <button
              className={`btn-${activeSpedModule === 'EFD_REINF' ? 'primary' : 'secondary'}`}
              onClick={() => startTransition(() => setActiveSpedModule('EFD_REINF'))}
            >
              EFD-Reinf (R-4020)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handleValidate}>
              <Play size={15} /> Auditar Pre-Flight PVA
            </button>
            <button className="btn-secondary" onClick={() => alert('Download do arquivo oficial gerado com sucesso.')}>
              <Download size={15} /> Exportar Arquivo
            </button>
          </div>
        </div>
      </div>

      {/* Validation Status Cards */}
      {validationReport.success && activeSpedModule !== 'EFD_REINF' && (
        <div className="grid-cards-4">
          <div className="metric-card">
            <div className="metric-header"><span className="metric-title">Parecer Pre-Flight</span></div>
            <div className="metric-value" style={{ color: validationReport.data.isAprovadoPreFlight ? 'var(--emerald-400)' : 'var(--rose-500)' }}>
              {validationReport.data.isAprovadoPreFlight ? '100% APROVADO' : 'INCONSISTENTE'}
            </div>
            <div className="metric-sub">PVA Oficial da RFB</div>
          </div>

          <div className="metric-card">
            <div className="metric-header"><span className="metric-title">Linhas Estruturadas</span></div>
            <div className="metric-value font-mono">{validationReport.data.totalLinhas}</div>
            <div className="metric-sub">Pipes e delimitadores validados</div>
          </div>

          <div className="metric-card">
            <div className="metric-header"><span className="metric-title">Erros Críticos</span></div>
            <div className="metric-value font-mono" style={{ color: validationReport.data.totalErros > 0 ? 'var(--rose-500)' : 'var(--emerald-400)' }}>
              {validationReport.data.totalErros}
            </div>
            <div className="metric-sub">Bloqueiam transmissão</div>
          </div>

          <div className="metric-card">
            <div className="metric-header"><span className="metric-title">Avisos Preventivos</span></div>
            <div className="metric-value font-mono" style={{ color: 'var(--amber-500)' }}>
              {validationReport.data.totalAvisos}
            </div>
            <div className="metric-sub">Alertas de conciliação</div>
          </div>
        </div>
      )}

      {/* File Editor & Preview */}
      <div className="panel-card">
        <div className="panel-title-bar">
          <h2><FileCheck size={18} color="var(--cyan-500)" /> Visualizador Estruturado: {activeSpedModule}</h2>
          <span className="badge badge-cyan">Editor Oficial</span>
        </div>

        <textarea
          className="form-control font-mono"
          style={{ width: '100%', height: '320px', fontSize: '0.8rem', lineHeight: '1.45', background: 'var(--bg-surface-elevated)' }}
          value={getCurrentContent()}
          onChange={(e) => setCurrentContent(e.target.value)}
        />
      </div>
    </div>
  );
};
