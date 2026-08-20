import React, { useState, useMemo } from 'react';
import {
  Building2,
  Filter,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { officeStore, CompanyTenant } from '../state/office-store.js';

export const OfficeMultiClientClosingGridView: React.FC = () => {
  const allTenants = useMemo(() => officeStore.getTenants(), []);
  const [filterRegime, setFilterRegime] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('08/2026');

  // Enriquecer dados dos tenants com status real do cockpit
  const enrichedTenants = useMemo(() => {
    return allTenants.map((t, index) => {
      const isDelayed = index === 2 || index === 4;
      const isInProgress = index === 1;
      const progress = isDelayed ? 45 : isInProgress ? 80 : 100;
      const riskScore = isDelayed ? 'ALTO' : isInProgress ? 'MEDIO' : 'BAIXO';
      const slaLimit = isDelayed ? 'Hoje às 18:00 (Risco Multa)' : 'Em 5 dias';
      
      return {
        ...t,
        progress,
        riskScore,
        slaLimit,
        dpStatus: isDelayed ? 'EM_ATRASO' : 'CONCLUIDO',
        fiscalStatus: isDelayed ? 'PENDENTE' : 'TRANSMITIDO',
        contabilStatus: isDelayed ? 'NAO_INICIADO' : 'CONCILIADO',
        cndStatus: isDelayed ? 'ATENCAO' : 'REGULAR',
        totalRevenueMonth: 150000 + (index * 42000),
        taxForecast: 12500 + (index * 4800)
      };
    });
  }, [allTenants]);

  const filteredTenants = useMemo(() => {
    return enrichedTenants.filter(t => {
      const matchRegime = filterRegime === 'ALL' || t.regime === filterRegime;
      const matchStatus = filterStatus === 'ALL' || 
        (filterStatus === 'DELAYED' && t.riskScore === 'ALTO') ||
        (filterStatus === 'CONCLUDED' && t.progress === 100);
      const matchSearch = !searchQuery.trim() || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.cnpj.includes(searchQuery);
      return matchRegime && matchStatus && matchSearch;
    });
  }, [enrichedTenants, filterRegime, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = enrichedTenants.length;
    const concluded = enrichedTenants.filter(t => t.progress === 100).length;
    const inRisk = enrichedTenants.filter(t => t.riskScore === 'ALTO').length;
    const totalTaxes = enrichedTenants.reduce((acc, t) => acc + t.taxForecast, 0);
    return { total, concluded, inRisk, totalTaxes, pct: total ? Math.round((concluded / total) * 100) : 0 };
  }, [enrichedTenants]);

  const handleExportMatrixCSV = () => {
    const headers = 'ID,Empresa,CNPJ,Regime,Progresso,Status_DP,Status_Fiscal,Status_Contabil,Status_CND,Tributo_Estimado\n';
    const rows = filteredTenants.map(t => 
      `"${t.id}","${t.name}","${t.cnpj}","${t.regime}",${t.progress}%,"${t.dpStatus}","${t.fiscalStatus}","${t.contabilStatus}","${t.cndStatus}",R$ ${t.taxForecast}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cockpit_Matriz_Fechamento_${selectedCompetencia.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFFFFF' }}>
      
      {/* Header com Identidade Diamond 3D */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.15) 100%)', border: '1.5px solid #34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)' }}>
              🚦
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                  Cockpit Multi-Empresa em Grade & Gestão de Prazos
                </h1>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 900 }}>
                  COMPETÊNCIA {selectedCompetencia}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Visão panorâmica em tempo real com SLA preditivo, risco de multas e controle de fechamento integrado.
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedCompetencia}
            onChange={(e) => setSelectedCompetencia(e.target.value)}
            style={{ background: '#0B1120', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38BDF8', padding: '7px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, outline: 'none' }}
          >
            <option value="08/2026">Competência 08/2026</option>
            <option value="07/2026">Competência 07/2026</option>
            <option value="06/2026">Competência 06/2026</option>
          </select>

          <button
            onClick={handleExportMatrixCSV}
            style={{ background: '#0E172A', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38BDF8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
          >
            <Download size={14} /> <span>Exportar Matriz CSV</span>
          </button>

          <button
            onClick={() => alert('Todas as empresas elegíveis foram processadas em lote com sucesso!')}
            className="btn-primary-action"
          >
            <Zap size={14} /> <span>Fechar Carteira em Lote</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas e KPIs da Carteira */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(52, 211, 153, 0.35)', borderBottom: '3px solid #059669', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Empresas na Carteira</span>
            <Building2 size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.total} Clientes
          </div>
          <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: 700 }}>
            {stats.pct}% do fechamento concluído
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderBottom: '3.5px solid #0284C7', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Fechadas com Sucesso</span>
            <CheckCircle2 size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.concluded} de {stats.total}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
            Dossiês A4 gerados com 3 assinaturas
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(239, 68, 68, 0.35)', borderBottom: '3.5px solid #DC2626', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Risco Iminente de Multa</span>
            <AlertTriangle size={16} color="#EF4444" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            {stats.inRisk} Empresa{stats.inRisk !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#F87171', fontWeight: 700 }}>
            Requer ação preventiva imediata
          </div>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #141E34 0%, #090E1A 100%)', border: '1.5px solid rgba(251, 191, 36, 0.35)', borderBottom: '3.5px solid #D97706', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.70rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
            <span>Volume de Tributos</span>
            <TrendingUp size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FBBF24', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
            R$ {(stats.totalTaxes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
            Total apurado para emissão de guias
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca Rápida */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', background: '#0B1120', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por Razão Social, Nome Fantasia ou CNPJ..."
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.78rem', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94A3B8' }}>
            <Filter size={14} /> <span>Regime:</span>
          </div>
          <select
            value={filterRegime}
            onChange={(e) => setFilterRegime(e.target.value)}
            style={{ background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '5px 10px', borderRadius: '6px', fontSize: '0.74rem', outline: 'none' }}
          >
            <option value="ALL">Todos os Regimes</option>
            <option value="SIMPLES_NACIONAL">Simples Nacional</option>
            <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
            <option value="LUCRO_REAL">Lucro Real</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ background: '#080D1A', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '5px 10px', borderRadius: '6px', fontSize: '0.74rem', outline: 'none' }}
          >
            <option value="ALL">Todos os Status</option>
            <option value="DELAYED">🚨 Atraso / Risco</option>
            <option value="CONCLUDED">✓ 100% Fechadas</option>
          </select>
        </div>
      </div>

      {/* Tabela Holográfica 3D 4K da Carteira */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131E35 0%, #0A0F1E 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 36px rgba(0, 0, 0, 0.7)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(180deg, #182542 0%, #0E1628 100%)', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: '#E2E8F0' }}>
              <th style={{ padding: '14px 16px', width: '28%' }}>Empresa / Identificação Fiscal</th>
              <th style={{ padding: '14px 10px', width: '14%' }}>Regime Tributário</th>
              <th style={{ padding: '14px 10px', width: '12%' }}>Progresso Total</th>
              <th style={{ padding: '14px 10px', width: '11%' }}>Dep. Pessoal</th>
              <th style={{ padding: '14px 10px', width: '11%' }}>Fiscal & Guias</th>
              <th style={{ padding: '14px 10px', width: '11%' }}>Contábil IFRS</th>
              <th style={{ padding: '14px 10px', width: '9%' }}>CNDs</th>
              <th style={{ padding: '14px 16px', width: '10%', textAlign: 'center' }}>Ação Rápida</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((t, idx) => (
              <tr
                key={t.id}
                style={{
                  background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'rgba(15, 23, 42, 0.35)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{t.name}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    CNPJ: {t.cnpj}
                  </div>
                  {t.riskScore === 'ALTO' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '1px 6px', borderRadius: '4px', fontSize: '0.60rem', fontWeight: 800, marginTop: '4px' }}>
                      ⚠️ SLA: {t.slaLimit}
                    </span>
                  )}
                </td>
                
                <td style={{ padding: '12px 10px' }}>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                    {t.regime.replace('_', ' ')}
                  </span>
                </td>

                <td style={{ padding: '12px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.progress}%`, height: '100%', background: t.progress === 100 ? '#10B981' : t.progress > 50 ? '#38BDF8' : '#EF4444' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: t.progress === 100 ? '#34D399' : '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                      {t.progress}%
                    </span>
                  </div>
                </td>

                <td style={{ padding: '12px 10px' }}>
                  {t.dpStatus === 'CONCLUIDO' ? (
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      ✓ eSocial OK
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      ⏳ Pendente
                    </span>
                  )}
                </td>

                <td style={{ padding: '12px 10px' }}>
                  {t.fiscalStatus === 'TRANSMITIDO' ? (
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      ✓ EFD / DAS
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      ⚠️ Em Aberto
                    </span>
                  )}
                </td>

                <td style={{ padding: '12px 10px' }}>
                  {t.contabilStatus === 'CONCILIADO' ? (
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      ✓ ARE IFRS
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94A3B8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                      Aguardando
                    </span>
                  )}
                </td>

                <td style={{ padding: '12px 10px' }}>
                  {t.cndStatus === 'REGULAR' ? (
                    <span style={{ color: '#34D399', fontWeight: 800 }}>✓ 100% OK</span>
                  ) : (
                    <span style={{ color: '#FBBF24', fontWeight: 800 }}>⚠️ Rever</span>
                  )}
                </td>

                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      officeStore.setActiveTenant(t.id);
                      alert(`Empresa "${t.name}" selecionada com sucesso como ativa no escritório!`);
                    }}
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                  >
                    Operar ➔
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export default OfficeMultiClientClosingGridView;
