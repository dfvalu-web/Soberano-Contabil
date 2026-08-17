const fs = require('fs');

const testCode = `import { describe, it, expect } from 'vitest';
import {
  evaluateAssetRetirementObligationCpc27,
  processBonificationAndDonationTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Desmantelamento ARO (CPC 27) & Bonificações Tributárias (Tema 1.050 STJ)', () => {
  it('1. Deve capitalizar valor presente de desmantelamento no imobilizado e apropriar juros e depreciacao (CPC 27 / ICPC 12)', () => {
    const res = evaluateAssetRetirementObligationCpc27({
      ativoId: 'PLATAFORMA-OFFSHORE-01',
      descricaoAtivo: 'Plataforma Petrolífera Offshore P-78',
      custoAquisicaoConstrucaoDiretoBrl: 500000000.00,
      custoFuturoEstimadoDesmantelamentoBrl: 100000000.00, // 100M daqui a 20 anos a 8% a.a.
      vidaUtilAnos: 20,
      taxaDescontoAnualPercent: 8
    });

    const data = unwrap(res);
    expect(data.valorPresenteDesmantelamentoCapitalizadoBrl).toBe(21454820.74);
    expect(data.custoTotalInicialImobilizadoBrl).toBe(521454820.74);
    expect(data.saldoInicialPassivoDesativacaoBrl).toBe(21454820.74);
    expect(data.depreciacaoAnualTotalBrl).toBe(26072741.04);
    expect(data.despesaFinanceiraAno1UnwindingBrl).toBe(1716385.66);
    expect(data.partidasDobradaReconhecimentoInicial.length).toBe(4);
    expect(data.partidasDobradaExercicioAno1.length).toBe(4);
    expect(data.diagnosticoCpc27).toContain('Asset Retirement Obligations');
  });

  it('2. Deve aplicar ICMS/IPI e excluir compulsoriamente PIS/COFINS em bonificacoes de mercadorias (Tema 1.050 STJ)', () => {
    // 2.1 Bonificação de Mercadorias (CFOP 5.910 com exclusão de PIS/COFINS pelo STJ)
    const resBon = processBonificationAndDonationTaxEngine({
      operacaoId: 'BONIF-01',
      tipoOperacao: 'BONIFICACAO_MERCADORIAS_VINCULADA',
      destinatarioNome: 'Supermercados Aliança S.A.',
      valorMercadoriasBrl: 1000000.00,
      custoEstoqueMercadoriaBrl: 600000.00,
      aliquotaIcmsPercent: 18, // 180k
      aliquotaIpiPercent: 10   // 100k
    });

    const dataBon = unwrap(resBon);
    expect(dataBon.cfopUtilizado).toBe('5.910');
    expect(dataBon.tributosIncidentes.icmsDevidoBrl).toBe(180000.00);
    expect(dataBon.tributosIncidentes.ipiDevidoBrl).toBe(100000.00);
    expect(dataBon.tributosIncidentes.pisExcluidoCompulsoriamenteTema1050StjBrl).toBe(16500.00);
    expect(dataBon.tributosIncidentes.cofinsExcluidaCompulsoriamenteTema1050StjBrl).toBe(76000.00);
    expect(dataBon.tributosIncidentes.totalTributosDevidosBrl).toBe(280000.00);
    expect(dataBon.partidasDobradaOperacao.length).toBe(4);
    expect(dataBon.diagnosticoFiscal).toContain('TEMA 1.050 DO STJ: Exclusão compulsória de PIS');

    // 2.2 Amostra Grátis (CFOP 5.911 com Isenção de ICMS/IPI)
    const resAmo = processBonificationAndDonationTaxEngine({
      operacaoId: 'AMOSTRA-01',
      tipoOperacao: 'AMOSTRA_GRATIS',
      destinatarioNome: 'Laboratório Médico Central Ltda',
      valorMercadoriasBrl: 50000.00,
      custoEstoqueMercadoriaBrl: 30000.00,
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10
    });

    const dataAmo = unwrap(resAmo);
    expect(dataAmo.cfopUtilizado).toBe('5.911');
    expect(dataAmo.tributosIncidentes.icmsDevidoBrl).toBe(0);
    expect(dataAmo.tributosIncidentes.ipiDevidoBrl).toBe(0);
    expect(dataAmo.partidasDobradaOperacao.length).toBe(2);
  });
});
`;

fs.writeFileSync('packages/core/tests/aro-bonification.test.ts', testCode, 'utf8');
console.log('Fixed ARO test expectations.');
