import { describe, it, expect } from 'vitest';
import {
  processOfficeLaborTerminationTrctEngine,
  processOfficeEsocialS2299SettlementEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Rescisão Trabalhista, TRCT Digital & eSocial S-2299 (CLT Art. 477)', () => {
  it('1. Deve calcular verbas rescisorias sem justa causa com aviso previo proporcional Lei 12.506/11 e emitir TRCT', () => {
    const resTerm = processOfficeLaborTerminationTrctEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio Varejista de Calçados Ltda',
      colaboradorCpf: '123.456.789-00',
      nomeColaborador: 'Carlos Eduardo da Silva',
      salarioBaseBrl: 5000.00,
      motivoRescisao: 'SEM_JUSTA_CAUSA_EMPREGADOR',
      mesesTrabalhadosAnoCorrente: 8,
      anosCompletosEmpresa: 3 // 30 + 9 = 39 dias de aviso
    });

    const dataTerm = unwrap(resTerm);
    expect(dataTerm.valorAvisoPrevioBrl).toBe(6500.00); // 39 dias
    expect(dataTerm.valorDecimoTerceiroPropBrl).toBe(3333.33); // 8/12 de 5000
    expect(dataTerm.valorFeriasProporcionaisMaisTercoBrl).toBe(4444.44); // 8/12 de 5000 * 1.333
    expect(dataTerm.documentoTrctDigitalGerado).toContain('TRCT Portaria MTE nº 1.057/12');
    expect(dataTerm.statusRescisao).toBe('RESCISAO_CALCULADA_TRCT_EMITIDO');
    expect(dataTerm.diagnosticoRescisao).toContain('39 dias');
  });

  it('2. Deve transmitir evento eSocial S-2299 e validar tempestividade do pagamento (10 dias corridos Art. 477)', () => {
    const resEsoc = processOfficeEsocialS2299SettlementEngine({
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Comércio Varejista de Calçados Ltda',
      colaboradorCpf: '123.456.789-00',
      dataDesligamento: '2026-08-01',
      dataPagamentoEfetivo: '2026-08-07', // 6 dias decorridos (< 10 dias)
      salarioBaseColaboradorBrl: 5000.00
    });

    const dataEsoc = unwrap(resEsoc);
    expect(dataEsoc.reciboTransmissaoEsocialS2299).toContain('1.2.202608');
    expect(dataEsoc.diasCorridosAtePagamento).toBe(6);
    expect(dataEsoc.incideMultaArt477Clt).toBe(false);
    expect(dataEsoc.valorMultaArt477Brl).toBe(0.00);
    expect(dataEsoc.statusEsocial).toBe('EVENTO_S2299_TRANSMITIDO_COM_SUCESSO');
    expect(dataEsoc.diagnosticoEsocial).toContain('NÃO INCIDE (TEMPESTIVO)');
  });
});
