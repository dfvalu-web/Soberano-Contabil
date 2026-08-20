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

    expect(html).toContain('DIFERENCIAIS ÚNICOS DE MERCADO');
    expect(html).toContain('1. Esteira de Fechamento Integrada (5 Etapas)');
    expect(html).toContain('2. Radar Preditivo contra Malhas Fiscais');
    expect(html).toContain('3. Book Contábil Executivo A4 (Rating AAA)');
    expect(html).toContain('4. Motor da Reforma Tributária (2026–2033)');
    expect(html).toContain('5. Dropzone Massivo com OCR Inteligente');
    expect(html).toContain('6. Folha CLT &amp; eSocial/SST Determinístico');
    expect(html).toContain('Por que o Soberano Contábil é Líder Absoluto?');
  });

  it('3. Renderiza a seção dos 4 Pilares Arquiteturais (#pilares)', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('id="pilares"');
    expect(html).toContain('OS 4 PILARES ARQUITETURAIS DO SOBERANO CONTÁBIL');
    expect(html).toContain('1. Contabilidade &amp; IFRS');
    expect(html).toContain('2. Fiscal &amp; Tributário');
    expect(html).toContain('3. Departamento Pessoal');
    expect(html).toContain('4. Governança &amp; CFO Virtual');
  });

  it('4. Renderiza o formulário de contato completo 3D 4K com Pessoa Jurídica (CNPJ) e Pessoa Física (CPF)', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('id="contato"');
    expect(html).toContain('CANAL DIRETO &amp; CONSULTORIA CORPORATIVA');
    expect(html).toContain('Fale com Nossos Especialistas &amp; Solicite uma Proposta');
    expect(html).toContain('Pessoa Jurídica (PJ / Empresa)');
    expect(html).toContain('Pessoa Física (PF / Autônomo)');
    expect(html).toContain('Razão Social ou Nome Fantasia');
    expect(html).toContain('CNPJ da Empresa');
    expect(html).toContain('Número Estimado de Funcionários');
    expect(html).toContain('Telefone Celular / WhatsApp');
  });

  it('5. Renderiza o sistema de autenticação corporativo e garantias de qualidade', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('Entrar no Soberano Contábil');
    expect(html).toContain('Solicitar Proposta');
    expect(html).toContain('Compromisso Soberano de Qualidade');
    expect(html).toContain('NBC TG / IFRS Full');
    expect(html).toContain('SOBERANO CONTÁBIL PLATINUM SUITE');
  });

  it('6. Renderiza a seção de Migração Sem Trauma 3D 4K (#migracao) com os 10 softwares legados', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingAndLoginPremiumView, { onLoginSuccess: () => {} })
    );

    expect(html).toContain('id="migracao"');
    expect(html).toContain('Migração Sem Trauma');
    expect(html).toContain('Migre Seu Escritório Para o Soberano');
    expect(html).toContain('Domínio Sistemas');
    expect(html).toContain('Alterdata Pack');
    expect(html).toContain('Fortes Tecnologia');
    expect(html).toContain('Senior Sistemas');
    expect(html).toContain('Prosoft');
    expect(html).toContain('Contmatic Phoenix');
    expect(html).toContain('Questor Sistemas');
    expect(html).toContain('SCI Sistemas Contábeis');
    expect(html).toContain('TOTVS Protheus / RM');
    expect(html).toContain('Transição em &lt; 24h');
  });
});
