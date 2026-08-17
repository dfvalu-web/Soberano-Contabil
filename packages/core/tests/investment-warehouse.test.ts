import { describe, it, expect } from 'vitest';
import {
  evaluateInvestmentPropertyCpc28,
  processGeneralWarehouseSalesOperation,
  unwrap
} from '../src/index.js';

describe('TESTES: Propriedades para Investimento (CPC 28) & Armazém Geral (Convênio S/N 1970)', () => {
  it('1. Deve mensurar propriedade para investimento a valor justo, reconhecer ganho no resultado e cessar depreciacao (CPC 28)', () => {
    const res = evaluateInvestmentPropertyCpc28({
      propriedadeId: 'IMOVEL-INVEST-01',
      descricaoImovel: 'Edifício Comercial Faria Lima Tower',
      modeloMensuracao: 'VALOR_JUSTO',
      valorContabilAnteriorBrl: 70000000.00,
      valorJustoAvaliadoBrl: 85000000.00, // Ganho VJ = 15.000.000,00
      receitaAluguelExercicioBrl: 6000000.00,
      aliquotaTributosDiferidosPercent: 34 // 34% de 15M = 5.1M PFD
    });

    const data = unwrap(res);
    expect(data.valorContabilFinalBrl).toBe(85000000.00);
    expect(data.ganhoOuPerdaValorJustoResultadoBrl).toBe(15000000.00);
    expect(data.tributosDiferidosSobreGanho34PercentBrl).toBe(5100000.00);
    expect(data.depreciacaoCessada).toBe(true);
    expect(data.partidasDobradaPropriedadeInvestimento.length).toBe(4);
    expect(data.diagnosticoCpc28).toContain('CPC 28 / IAS 40 (Modelo do Valor Justo)');
  });

  it('2. Deve processar venda com saida direta de Armazem Geral e emitir as 3 NFs sincronizadas (Convenio S/N 1970)', () => {
    const res = processGeneralWarehouseSalesOperation({
      operacaoId: 'OP-ARMAZEM-01',
      depositanteNome: 'Agroindústria Soberano S.A.',
      armazemGeralNome: 'Logística Portuária de Santos Armazéns Gerais S.A.',
      compradorFinalNome: 'Exportadora Internacional de Grãos Ltda',
      valorMercadoriaBrl: 2000000.00,
      aliquotaIcmsPercent: 18,
      aliquotaIpiPercent: 10
    });

    const data = unwrap(res);
    const nfs = data.notasFiscaisArmazemGeral;

    // NF 1: Venda do Depositante ao Comprador (CFOP 5.105 com ICMS e IPI)
    expect(nfs.nf1VendaDepositanteParaComprador.cfop).toBe('5.105');
    expect(nfs.nf1VendaDepositanteParaComprador.valorTotalBrl).toBe(2000000.00);
    expect(nfs.nf1VendaDepositanteParaComprador.icmsDestacadoBrl).toBe(360000.00); // 18% de 2M
    expect(nfs.nf1VendaDepositanteParaComprador.ipiDestacadoBrl).toBe(200000.00);  // 10% de 2M

    // NF 2: Retorno Simbólico do Armazém ao Depositante (CFOP 5.907)
    expect(nfs.nf2RetornoSimbolicoArmazemParaDepositante.cfop).toBe('5.907');
    expect(nfs.nf2RetornoSimbolicoArmazemParaDepositante.icmsDestacadoBrl).toBe(0);

    // NF 3: Remessa por Conta e Ordem do Armazém ao Comprador (CFOP 5.925)
    expect(nfs.nf3RemessaContaEOrdemArmazemParaComprador.cfop).toBe('5.925');
    expect(nfs.nf3RemessaContaEOrdemArmazemParaComprador.icmsDestacadoBrl).toBe(0);

    expect(data.diagnosticoArmazemGeral).toContain('Armazém Geral (Art. 6º ao 33 do Convênio S/Nº de 1970');
  });
});
