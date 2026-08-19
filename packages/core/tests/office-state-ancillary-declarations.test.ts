import { describe, it, expect } from 'vitest';
import {
  processOfficeStateAncillaryDeclarationsEngine,
  processOfficeGiaDestdaCrossauditEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Obrigações Acessórias Estaduais (GIA, DeSTDA, DIME & DAPI)', () => {
  it('1. Deve apurar GIA-SP com ICMS proprio, ICMS ST e DIFAL gerando arquivo estruturado', () => {
    const resGia = processOfficeStateAncillaryDeclarationsEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Atacadista Distribuidor Paulista S/A',
      inscricaoEstadual: '110.123.456.789',
      uf: 'SP',
      tipoDeclaracao: 'GIA_SP',
      mesAnoCompetencia: '2026-08',
      valorTotalDebitosIcmsBrl: 150000.00,
      valorTotalCreditosIcmsBrl: 100000.00,
      valorIcmsStDevidoBrl: 25000.00,
      valorDifalDevidoBrl: 8000.00
    });

    const dataGia = unwrap(resGia);
    expect(dataGia.saldoIcmsProprioARecolherBrl).toBe(50000.00); // 150k - 100k
    expect(dataGia.saldoIcmsStARecolherBrl).toBe(25000.00);
    expect(dataGia.saldoDifalARecolherBrl).toBe(8000.00);
    expect(dataGia.arquivoEstruturadoGerado).toContain('GIA_SP_SP_202608');
    expect(dataGia.statusDeclaracao).toBe('DECLARACAO_ESTADUAL_APURADA_E_PRONTA_ENVIO');
    expect(dataGia.diagnosticoEstadual).toContain('GIA_SP');
  });

  it('2. Deve auditar consistencia entre GIA e SPED Fiscal EFD eliminando inconsistencias DEC', () => {
    const resCross = processOfficeGiaDestdaCrossauditEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Atacadista Distribuidor Paulista S/A',
      mesAnoCompetencia: '2026-08',
      valorIcmsDeclaradoGiaBrl: 50000.00,
      valorIcmsApuradoSpedEfdBrl: 50000.00,
      valorIcmsStDeclaradoGiaBrl: 25000.00,
      valorIcmsStApuradoSpedEfdBrl: 25000.00
    });

    const dataCross = unwrap(resCross);
    expect(dataCross.divergenciaIcmsProprioBrl).toBe(0.00);
    expect(dataCross.divergenciaIcmsStBrl).toBe(0.00);
    expect(dataCross.statusCruzamento).toBe('GIA_E_SPED_EFD_100_CONCILIADOS');
    expect(dataCross.diagnosticoCruzamento).toContain('GIA_E_SPED_EFD_100_CONCILIADOS');
  });
});
