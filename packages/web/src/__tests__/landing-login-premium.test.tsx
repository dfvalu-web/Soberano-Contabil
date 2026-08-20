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
    expect(html).toContain('A Plataforma Definitiva de');
    expect(html).toContain('/hero-video.mp4');
  });

  it('2. Renderiza os 6 grandes diferenciais competitivos e tabela de mercado', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('Diferenciais Únicos de Mercado');
    expect(html).toContain('1. Esteira de Fechamento Integrada (5 Etapas)');
    expect(html).toContain('2. Radar Preditivo contra Malhas Fiscais');
    expect(html).toContain('3. Book Contábil Executivo A4 (Rating AAA)');
    expect(html).toContain('4. Motor da Reforma Tributária (2026–2033)');
    expect(html).toContain('5. Dropzone Massivo com OCR Inteligente');
    expect(html).toContain('6. Folha CLT &amp; eSocial/SST Determinístico');
    expect(html).toContain('Por que o Soberano Contábil é Líder Absoluto?');
  });

  it('3. Renderiza o sistema de autenticação robusto por email com abas e perfis', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('E-mail Corporativo');
    expect(html).toContain('Senha de Acesso');
    expect(html).toContain('David Valu');
    expect(html).toContain('Dra. Beatriz Santos');
    expect(html).toContain('Carlos Mendes');
    expect(html).toContain('Diretoria Executiva');
    expect(html).toContain('CALCULADORA DE ECONOMIA OPERACIONAL');
  });
});
