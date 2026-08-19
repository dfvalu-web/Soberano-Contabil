import { describe, it, expect } from 'vitest';
import {
  processOfficeTaxWithholdingsReinfEngine,
  processOfficeCsrfIrrfRetentionCrossauditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Retenções Tributárias na Fonte & EFD-Reinf', () => {
  it('1. Deve registrar eventos da Serie R-4000 e fechar periodo com R-4099 integrado a DCTFWeb', () => {
    const resReinf = processOfficeTaxWithholdingsReinfEngine({
      tomadorCnpj: '11.111.111/0001-11',
      tomadorRazaoSocial: 'Construtora & Engenharia Pioneira S/A',
      mesCompetencia: '2026-08',
      pagamentosServicos: [
        {
          prestadorCnpjCpf: '22.222.222/0001-22',
          prestadorRazaoSocial: 'Consultoria de Projetos Alfa Ltda',
          naturezaRendimentoCodigo: '15001',
          tipoPessoa: 'PESSOA_JURIDICA',
          dataFatoGerador: '2026-08-15',
          valorBrutoServicoBrl: 100000.00,
          valorIrrfRetidoBrl: 1500.00, // 1.5%
          valorCsrfRetidoBrl: 4650.00, // 4.65%
          valorInssRetidoBrl: 0
        },
        {
          prestadorCnpjCpf: '33.333.333/0001-33',
          prestadorRazaoSocial: 'Serviços de Limpeza & Conservação Beta Ltda',
          naturezaRendimentoCodigo: '15002',
          tipoPessoa: 'PESSOA_JURIDICA',
          dataFatoGerador: '2026-08-20',
          valorBrutoServicoBrl: 50000.00,
          valorIrrfRetidoBrl: 500.00, // 1.0%
          valorCsrfRetidoBrl: 2325.00, // 4.65%
          valorInssRetidoBrl: 5500.00 // 11%
        }
      ]
    });

    const dataReinf = unwrap(resReinf);
    expect(dataReinf.totalPagamentosRegistrados).toBe(2);
    expect(dataReinf.totalIrrfRetidoBrl).toBe(2000.00);
    expect(dataReinf.totalCsrfRetidoBrl).toBe(6975.00);
    expect(dataReinf.totalInssRetidoBrl).toBe(5500.00);
    expect(dataReinf.totalGeralRetencoesBrl).toBe(14475.00);
    expect(dataReinf.eventoFechamentoR4099Transmitido).toBe(true);
    expect(dataReinf.statusReinf).toBe('EVENTOS_REINF_R4000_TRANSMITIDOS_DCTFWEB_INTEGRADA');
    expect(dataReinf.diagnosticoReinf).toContain('DCTFWeb');
  });

  it('2. Deve calcular retencoes na fonte sobre servicos tomados e apurar valor liquido a pagar', () => {
    const resRet = processOfficeCsrfIrrfRetentionCrossauditEngine({
      clienteCnpj: '44.444.444/0001-44',
      razaoSocial: 'Hospital e Maternidade São Lucas S/A',
      tipoServico: 'SERVICOS_PROFISSIONAIS',
      valorBrutoNotaBrl: 10000.00,
      municipioTomadorPrestadorIguais: true,
      aliquotaIssLocalPercent: 5.0
    });

    const dataRet = unwrap(resRet);
    expect(dataRet.valorBrutoNotaBrl).toBe(10000.00);
    expect(dataRet.aliquotaIrrfPercent).toBe(1.5);
    expect(dataRet.valorIrrfBrl).toBe(150.00);
    expect(dataRet.aliquotaCsrfPercent).toBe(4.65);
    expect(dataRet.valorCsrfBrl).toBe(465.00);
    expect(dataRet.valorLiquidoPagarBrl).toBe(9385.00); // 10k - 150 - 465
    expect(dataRet.statusCalculo).toBe('RETENCOES_APURADAS_COM_SUCESSO');
    expect(dataRet.diagnosticoRetencoes).toContain('Líquido a Pagar');
  });
});
