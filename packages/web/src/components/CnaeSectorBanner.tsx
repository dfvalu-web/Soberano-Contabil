import React, { useState } from 'react';
import { CompanyTenant } from '../state/office-store';
import { matchSectorProfile, getRecommendedModulesForTenant } from '../config/cnae-sector-matcher';
import { Sparkles, ChevronRight, X, ShieldCheck, Zap } from 'lucide-react';

interface CnaeSectorBannerProps {
  tenant: CompanyTenant | undefined | null;
  onSelectModule: (moduleId: string) => void;
  currentModuleId: string;
}

export const CnaeSectorBanner: React.FC<CnaeSectorBannerProps> = ({
  tenant,
  onSelectModule,
  currentModuleId
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const profile = matchSectorProfile(tenant);

  if (!profile || isDismissed || !tenant) {
    return null;
  }

  const recommendedModules = getRecommendedModulesForTenant(tenant);

  return (
    <div
      className="no-print"
      style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>{profile.icon}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                Inteligência Setorial Ativada: {profile.name}
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: 'var(--emerald-400)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}
              >
                CNAE {tenant.cnaePrincipal.split(' ')[0]}
              </span>
              <span
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan-400)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                {tenant.regime.replace('_', ' ')}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              ⚖️ <strong>Base Legal:</strong> {profile.legalFramework} • 💡 {profile.economicBenefitSummary}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '0.9rem'
          }}
          title="Ocultar aviso setorial"
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Módulos Recomendados para {tenant.name}:
          </span>
          {recommendedModules.slice(0, 4).map(mod => {
            const isActive = currentModuleId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary, #94A3B8)',
                  border: isActive ? '1.5px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.4)' : 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{mod.icon}</span>
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--emerald-400)' }}>
          <Zap size={12} />
          <span>Sincronização Contábil Automática Ativa</span>
        </div>
      </div>
    </div>
  );
};
export default CnaeSectorBanner;