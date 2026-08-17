import { describe, it, expect } from 'vitest';
import {
  evaluateEmployeeBenefitsCpc33,
  calculateRetRealEstateTax,
  unwrap
} from '../src/index.js';

describe('TESTES: Benefícios a Empregados (CPC 33) & RET Incorporação Imobiliária (Lei 10.931/2004)', () => {
  it('1. Deve contabilizar Plano de Contribuicao Definida e Beneficio Definido com DRA (CPC 33)', () => {
    // 1.1 Contribuição Definida
    const resCd = evaluateEmployeeBenefitsCpc33({
      planoId: 'PREV-CD-01',
      nomePlanoPrevidencia: 'Plano Futuro Seguro CD',
      tipoPlano: 'CONTRIBUICAO_DEFINIDA',
      contribuicoesPagasNoExercicioBrl: 500000.00
    });

    const dataCd = unwrap(resCd);
    expect(dataCd.tipoPlano).toBe('CONTRIBUICAO_DEFINIDA');
    expect(dataCd.despesaPrevidenciariaNoResultadoBrl).toBe(500000.00);
    expect(dataCd.partidasDobradaPrevidencia.length).toBe(2);

    // 1.2 Benefício Definido
    const resBd = evaluateEmployeeBenefitsCpc33({
      planoId: 'PREV-BD-02',
      nomePlanoPrevidencia: 'Fundo Multipatrocinado BD',
      tipoPlano: 'BENEFICIO_DEFINIDO',
      obrigacaoBeneficioDefinidoVpBrl: 50000000.00, // DBO = 50M
      ativosDoPlanoValorJustoBrl: 42000000.00,      // Ativos = 42M (Déficit = 8M)
      custoServicoCorrenteExercicioBrl: 1200000.00, // Custo Serviço = 1.2M
      taxaDescontoAtuarialPercentAno: 8.0,          // Juros Líquidos = 8% de 8M = 640k (Despesa = 1.84M)
      ganhoOuPerdaAtuarialPeriodoBrl: -300000.00     // Perda atuarial 300k no DRA
    });

    const dataBd = unwrap(resBd);
    expect(dataBd.passivoOuAtivoLiquidoAtuarialBrl).toBe(8000000.00);
    expect(dataBd.despesaPrevidenciariaNoResultadoBrl).toBe(1840000.00);
    expect(dataBd.remensuracaoAtuarialNoDraBrl).toBe(-300000.00);
    expect(dataBd.partidasDobradaPrevidencia.length).toBe(3);
    expect(dataBd.diagnosticoCpc33).toContain('Déficit Atuarial Líquido');
  });

  it('2. Deve apurar o RET da construcao civil a 4% (padrao) e 1% (MCMV) com segregacao tributaria (Lei 10.931/2004)', () => {
    // 2.1 RET Padrão (4%)
    const res4 = calculateRetRealEstateTax({
      incorporacaoId: 'INC-RESERVA-01',
      nomeEmpreendimento: 'Residencial Reserva Imperial',
      numeroMatriculaRgiAfetacao: 'RGI-CRI-2026-998877',
      modalidade: 'RET_PADRAO_4_PERCENT',
      receitaMensalIncorporacaoBrl: 10000000.00 // R$ 10.000.000,00
    });

    const data4 = unwrap(res4);
    expect(data4.aliquotaUnificadaPercent).toBe(4.0);
    expect(data4.tributosUnificadosRet.irpjBrl).toBe(126000.00); // 1.26%
    expect(data4.tributosUnificadosRet.csllBrl).toBe(66000.00);  // 0.66%
    expect(data4.tributosUnificadosRet.pisBrl).toBe(37000.00);   // 0.37%
    expect(data4.tributosUnificadosRet.cofinsBrl).toBe(171000.00); // 1.71%
    expect(data4.tributosUnificadosRet.totalRetAPagarBrl).toBe(400000.00); // 4% = 400k
    expect(data4.diagnosticoRet).toContain('Residencial Reserva Imperial');

    // 2.2 RET Minha Casa Minha Vida (1%)
    const res1 = calculateRetRealEstateTax({
      incorporacaoId: 'INC-MCMV-02',
      nomeEmpreendimento: 'Condomínio Social Esperança MCMV',
      numeroMatriculaRgiAfetacao: 'RGI-CRI-2026-112233',
      modalidade: 'RET_MCMV_INTERESSE_SOCIAL_1_PERCENT',
      receitaMensalIncorporacaoBrl: 5000000.00 // R$ 5.000.000,00
    });

    const data1 = unwrap(res1);
    expect(data1.aliquotaUnificadaPercent).toBe(1.0);
    expect(data1.tributosUnificadosRet.totalRetAPagarBrl).toBe(50000.00); // 1% = 50k
  });
});
