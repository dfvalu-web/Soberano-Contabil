import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LandingAndLoginPremiumView, PRESET_PROFILES } from '../views/LandingAndLoginPremiumView';

describe('Landing Page & Login Premium 3D 4K Suite', () => {
  it('1. Renderiza a Landing Page corporativa com vídeo background e identidade institucional', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('Soberano');
    expect(html).toContain('Contábil');
    expect(html).toContain('PLATINUM SUITE ENTERPRISE v4.5');
    expect(html).toContain('Governança Contábil de Elite &amp; Automação Determinística');
    expect(html).toContain('/hero-video.mp4');
  });

  it('2. Renderiza os 4 pilares estratégicos 3D na Landing Page', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('Esteira de Fechamento');
    expect(html).toContain('Radar de Malhas RFB');
    expect(html).toContain('Book Contábil A4');
    expect(html).toContain('Reforma IBS/CBS');
  });

  it('3. Renderiza o Card de Autenticação Corporativa com os 4 perfis de acesso', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('Autenticação Corporativa');
    expect(html).toContain('David Valu');
    expect(html).toContain('Dra. Beatriz Santos');
    expect(html).toContain('Carlos Mendes');
    expect(html).toContain('Diretoria Executiva');
    expect(html).toContain('Certificado Digital (e-CNPJ / e-CPF A1 &amp; A3)');
    expect(html).toContain('Criptografia de Ponta a Ponta AES-256');
  });
});
