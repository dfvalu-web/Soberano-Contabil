import { describe, it, expect } from 'vitest';
import {
  processOfficeCardPixCrossAuditEngine,
  processOfficeDimpDecredDivergenceEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Auditoria de Cartões, PIX & Marketplace (DIMP / DECRED / SEFAZ)', () => {
  it('1. Deve conciliar notas fiscais emitidas contra relatorios DIMP de adquirentes e PIX', () => {
    const resAudit = processOfficeCardPixCrossAuditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Restaurante e Gastronomia Sabor Real Ltda',
      mesCompetencia: '2026-08',
      totalNotasFiscaisEmitidasBrl: 120000.00,
      relatoriosAdquirentesDimp: [
        {
          operadoraNome: 'Cielo / Stone',
          tipoOperacao: 'CARTAO_CREDITO',
          valorProcessadoDimpBrl: 65000.00
        },
        {
          operadoraNome: 'Pix Banco do Brasil',
          tipoOperacao: 'PIX_ESTABELECIMENTO',
          valorProcessadoDimpBrl: 45000.00
        },
        {
          operadoraNome: 'iFood Repasses',
          tipoOperacao: 'MARKETPLACE',
          valorProcessadoDimpBrl: 10000.00
        }
      ]
    });

    const dataAudit = unwrap(resAudit);
    expect(dataAudit.totalNotasFiscaisBrl).toBe(120000.00);
    expect(dataAudit.totalMeiosPagamentoDimpBrl).toBe(120000.00);
    expect(dataAudit.diferencaReceitaBrl).toBe(0.00);
    expect(dataAudit.statusConformidade).toBe('CONCILIACAO_CARTAO_PIX_100_CONFORME');
    expect(dataAudit.diagnosticoAuditoria).toContain('100% coberto por documentos fiscais');
  });

  it('2. Deve calcular retificacao espontanea e economia de multas sob o Art. 138 do CTN', () => {
    const resRetif = processOfficeDimpDecredDivergenceEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'E-commerce e Vestuário Moda Bella Ltda',
      regimeTributario: 'SIMPLES_NACIONAL',
      valorReceitaOmitidaBrl: 50000.00,
      aliquotaEfetivaTributacaoPercent: 8.0 // 8% Simples
    });

    const dataRetif = unwrap(resRetif);
    expect(dataRetif.valorReceitaRegularizadaBrl).toBe(50000.00);
    expect(dataRetif.tributoPrincipalRegularizadoBrl).toBe(4000.00); // 50k * 8%
    expect(dataRetif.multaDeOficioEvitadaBrl).toBe(3000.00); // 4k * 75%
    expect(dataRetif.statusRegularizacao).toBe('DENUNCIA_ESPONTANEA_CTN_138_REGULARIZADA');
    expect(dataRetif.diagnosticoRegularizacao).toContain('Economia de Multa Punitiva SEFAZ (75%): R$ 3.000');
  });
});
