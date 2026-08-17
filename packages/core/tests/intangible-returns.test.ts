import { describe, it, expect } from 'vitest';
import {
  evaluateIntangibleAssetAndRdCpc04,
  processReturnAndCancellationTaxEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Ativos Intangíveis & P&D (CPC 04) & Devoluções Fiscais (RICMS 453)', () => {
  it('1. Deve segregar pesquisa como despesa imediata e capitalizar desenvolvimento com amortizacao (CPC 04 R1 / IAS 38)', () => {
    const res = evaluateIntangibleAssetAndRdCpc04({
      projetoId: 'PD-IA-01',
      nomeProjeto: 'Plataforma IA Soberano Contábil 2.0',
      gastosFasePesquisaBrl: 1000000.00, // Despesa imediata
      gastosFaseDesenvolvimentoBrl: 4500000.00, // Ativo capitalizado
      viabilidadeTecnicaEComercialAtestada: true,
      vidaUtilMeses: 60, // 5 anos -> 75k/mês
      mesesAmortizacaoExercicio: 12 // 12 * 75k = 900.000,00
    });

    const data = unwrap(res);
    expect(data.totalDespesaPesquisaResultadoBrl).toBe(1000000.00);
    expect(data.totalAtivoIntangivelCapitalizadoBrl).toBe(4500000.00);
    expect(data.vidaUtilClassificacao).toBe('DEFINIDA');
    expect(data.despesaAmortizacaoExercicioBrl).toBe(900000.00);
    expect(data.saldoContabilLiquidoFinalBrl).toBe(3600000.00);
    expect(data.partidasDobradaIntangivel.length).toBe(6);
    expect(data.diagnosticoCpc04).toContain('CPC 04 (R1) / IAS 38');
  });

  it('2. Deve processar devolucao de vendas com recuperacao/credito integral de tributos (Art. 453 RICMS)', () => {
    // 2.1 Devolução de Venda de Cliente Contribuinte (CFOP 1.202)
    const resCli = processReturnAndCancellationTaxEngine({
      devolucaoId: 'DEV-CLI-01',
      tipoDevolucao: 'DEVOLUCAO_VENDA_CLIENTE_CONTRIBUINTE',
      parceiroNome: 'Comercial Distribuidora Delta Ltda',
      valorMercadoriasDevolvidasBrl: 500000.00,
      aliquotaIcmsPercent: 18, // 90k
      aliquotaIpiPercent: 10,  // 50k
      aliquotaPisPercent: 1.65,  // 8.25k
      aliquotaCofinsPercent: 7.60, // 38k (Total = 186.25k)
      custoEstoqueMercadoriaBrl: 300000.00
    });

    const dataCli = unwrap(resCli);
    expect(dataCli.cfopUtilizado).toBe('1.202');
    expect(dataCli.tributosRecuperadosOuEstornados.icmsCreditoOuEstornoBrl).toBe(900000.00 / 10);
    expect(dataCli.tributosRecuperadosOuEstornados.ipiCreditoOuEstornoBrl).toBe(500000.00 / 10);
    expect(dataCli.tributosRecuperadosOuEstornados.pisCreditoBrl).toBe(8250.00);
    expect(dataCli.tributosRecuperadosOuEstornados.cofinsCreditoBrl).toBe(38000.00);
    expect(dataCli.tributosRecuperadosOuEstornados.totalRecuperacaoTributariaBrl).toBe(186250.00);
    expect(dataCli.partidasDobradaDevolucao.length).toBe(4);
    expect(dataCli.diagnosticoDevolucao).toContain('NF-e de Devolução emitida pelo Cliente Contribuinte');

    // 2.2 Devolução de Compra ao Fornecedor (CFOP 5.202)
    const resForn = processReturnAndCancellationTaxEngine({
      devolucaoId: 'DEV-FORN-02',
      tipoDevolucao: 'DEVOLUCAO_COMPRA_FORNECEDOR',
      parceiroNome: 'Indústria Química Fornecedora S.A.',
      valorMercadoriasDevolvidasBrl: 200000.00,
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10,
      aliquotaPisPercent: 1.65,
      aliquotaCofinsPercent: 7.60,
      custoEstoqueMercadoriaBrl: 200000.00
    });

    const dataForn = unwrap(resForn);
    expect(dataForn.cfopUtilizado).toBe('5.202');
    expect(dataForn.partidasDobradaDevolucao.length).toBe(2);
  });
});
