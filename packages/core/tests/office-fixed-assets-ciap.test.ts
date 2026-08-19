import { describe, it, expect } from 'vitest';
import {
  processOfficeFixedAssetsDepreciationCpc27Engine,
  processOfficeCiapSpedBlocoGEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Ativo Imobilizado (CPC 27) & CIAP Bloco G do SPED', () => {
  it('1. Deve calcular cota mensal de depreciacao e lancar no Ativo Nao Circulante conforme CPC 27', () => {
    const resDeprec = processOfficeFixedAssetsDepreciationCpc27Engine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Indústria Têxtil Catarinense S/A',
      mesCompetencia: '2026-08',
      itensAtivo: [
        {
          patrimonioId: 'PAT-001',
          descricaoBem: 'Tear Industrial Automático',
          categoria: 'MAQUINAS_EQUIPAMENTOS',
          dataAquisicao: '2026-01-10',
          valorAquisicaoBrl: 120000.00,
          valorResidualEstimadoBrl: 20000.00, // Base depreciável = 100k
          vidaUtilAnos: 10 // 10% a.a. -> 10k/ano -> 833.33/mês
        }
      ]
    });

    const dataDeprec = unwrap(resDeprec);
    expect(dataDeprec.totalBensCadastrados).toBe(1);
    expect(dataDeprec.totalCustoAquisicaoBrl).toBe(120000.00);
    expect(dataDeprec.totalDepreciacaoMensalBrl).toBeCloseTo(833.33, 2);
    expect(dataDeprec.totalValorContabilLiquidoBrl).toBeCloseTo(119166.67, 2);
    expect(dataDeprec.lancamentosContabeisDepreciacao.length).toBe(1);
    expect(dataDeprec.statusCalculo).toBe('DEPRECIACAO_CPC27_APURADA_LANCADA');
    expect(dataDeprec.diagnosticoDepreciacao).toContain('CPC 27');
  });

  it('2. Deve apurar credito mensal de 1/48 avos de ICMS no CIAP ajustado pelo fator de apropriacao do Bloco G', () => {
    const resCiap = processOfficeCiapSpedBlocoGEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Fábrica de Peças Automotivas Ltda',
      mesCompetencia: '2026-08',
      valorTotalSaidasTributadasBrl: 800000.00,
      valorTotalSaidasGeralBrl: 1000000.00, // Fator = 80% (0.80)
      bensCiap: [
        {
          identificadorBemCiap: 'CIAP-MACH-01',
          descricaoBem: 'Prensa Hidráulica 500T',
          valorTotalIcmsDestacadoBrl: 48000.00, // 1/48 = 1000.00/mês
          parcelaAtualNumero: 12
        }
      ]
    });

    const dataCiap = unwrap(resCiap);
    expect(dataCiap.fatorApropriacaoPercent).toBe(80.00);
    expect(dataCiap.totalCreditoIcmsApropriadoMesBrl).toBe(800.00); // 1000 * 80%
    expect(dataCiap.registrosBlocoGSpedFiscalQtd).toBe(4);
    expect(dataCiap.statusCiap).toBe('CIAP_BLOCO_G_APURADO_CONFORME_SPED_FISCAL');
    expect(dataCiap.diagnosticoCiap).toContain('G110, G125');
  });
});
