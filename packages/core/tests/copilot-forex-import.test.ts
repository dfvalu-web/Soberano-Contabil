import { describe, it, expect } from 'vitest';
import {
  askTaxAccountingCopilot,
  calculateForexRevaluation,
  calculateImportTaxation,
  unwrap
} from '../src/index.js';

describe('TESTES: Copiloto de IA Contábil, Variação Cambial (CPC 02) & Importação DUIMP', () => {
  it('1. Deve consultar o Copiloto Contabil sobre Fator R e obter fundamentacao legal formal', () => {
    const res = askTaxAccountingCopilot({
      pergunta: 'Como funciona o Fator R para saber se minha empresa de TI vai para o Anexo III ou V?',
      contextoEmpresa: {
        regimeTributario: 'SIMPLES_NACIONAL',
        uf: 'SP',
        cnaePrincipal: '6201501',
        faturamentoUltimos12Meses: 1000000.00,
        folhaUltimos12Meses: 300000.00 // 30% => Anexo III
      }
    });

    const data = unwrap(res);
    expect(data.intencaoDetectada).toBe('FATOR_R_SIMPLES');
    expect(data.respostaFundamentada).toContain('Anexo III');
    expect(data.fundamentacaoLegal.length).toBeGreaterThan(0);
    expect(data.fundamentacaoLegal[0]).toContain('Lei Complementar nº 123/2006');
  });

  it('2. Deve apurar variacao cambial ativa (CPC 02 R2) e gerar partidas dobradas de receita financeira', () => {
    const res = calculateForexRevaluation({
      transacaoId: 'EXPORT-001',
      moedaEstrangeira: 'USD',
      saldoMoedaEstrangeira: 100000.00, // $ 100,000
      taxaCambialPtaxAnterior: 5.00, // R$ 500,000
      taxaCambialPtaxFechamento: 5.30, // R$ 530,000 => Ganho cambial de R$ 30,000
      tipoItemMonetario: 'CLIENTES_EXTERIOR_ATIVO',
      opcaoTributariaLalur: 'REGIME_DE_COMPETENCIA'
    });

    const data = unwrap(res);
    expect(data.variacaoCambialApurada).toBe(30000.00);
    expect(data.tipoVariacao).toBe('VAR_CAMBIAL_ATIVA_RECEITA');
    expect(data.impactoLalurTrimestre).toBe(30000.00);
    expect(data.partidasDobradaSugeridas.length).toBe(2);
    expect(data.partidasDobradaSugeridas[0]!.type).toBe('DEBIT');
    expect(data.partidasDobradaSugeridas[1]!.type).toBe('CREDIT');
  });

  it('3. Deve calcular tributos de importacao aduaneira DUIMP com ICMS por dentro e custo de estoque', () => {
    const res = calculateImportTaxation({
      numeroDuimpOuDi: 'DUIMP-2026-BR-0099',
      valorMercadoriaMoedaEstrangeira: 20000.00, // USD 20k
      taxaCambialPtaxAduaneira: 5.00, // BRL 100k
      valorFreteInternacionalUsd: 1500.00,
      valorSeguroInternacionalUsd: 500.00, // Total CIF: USD 22k => BRL 110k
      aliquotaImpostoImportacaoPercent: 12, // II = 13.200,00
      aliquotaIpiImportacaoPercent: 10,
      aliquotaIcmsInternoPercent: 18,
      taxaSiscomexBrl: 214.50,
      despesasAduaneirasCapataziaBrl: 1500.00,
      regimeTributarioImportador: 'LUCRO_REAL'
    });

    const data = unwrap(res);
    expect(data.valorAduaneiroBrl).toBe(110000.00);
    expect(data.tributosAduaneiros.impostoImportacaoII).toBe(13200.00);
    expect(data.tributosAduaneiros.baseCalculoIcmsPorDentro).toBeGreaterThan(data.valorAduaneiroBrl);
    expect(data.tributosAduaneiros.icmsImportacao).toBeGreaterThan(0);
    expect(data.creditosFiscaisRecuperaveis.totalCreditosRecuperaveis).toBeGreaterThan(0);
    expect(data.custoAquisicaoLiquidoEstoque).toBeLessThan(data.custoTotalDesembaraco);
  });
});
