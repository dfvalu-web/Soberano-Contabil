import { describe, it, expect } from 'vitest';
import {
  processOfficeFeesCollectionDunningEngine,
  processOfficeContractSuspensionCfcEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Gestão de Honorários, Cobrança Pix & Suspensão CFC', () => {
  it('1. Deve calcular fatura com 13o honorario, aplicar juros/multa de mora e emitir Pix Copia e Cola', () => {
    const resFee = processOfficeFeesCollectionDunningEngine({
      faturaId: 'FAT-2026-1201',
      clienteCnpj: '11.111.111/0001-11',
      razaoSocial: 'Auto Posto Estrela do Sul Ltda',
      mesCompetencia: '2026-12',
      valorHonorarioBaseBrl: 3000.00,
      valorServicosExtrasBrl: 500.00,
      incluir13Honorario: true, // +3000 (Total = 6500)
      diasAtraso: 10 // Multa 2% (130) + Juros 1% pro-rata (21.67) = 6651.67
    });

    const dataFee = unwrap(resFee);
    expect(dataFee.valorTotalFaturaBrl).toBe(6500.00);
    expect(dataFee.valorMultaMoraBrl).toBe(130.00);
    expect(dataFee.valorJurosMoraBrl).toBeCloseTo(21.67, 2);
    expect(dataFee.totalLiquidoCobradoBrl).toBeCloseTo(6651.67, 2);
    expect(dataFee.etapaReguaCobranca).toBe('D_MAIS_5_COBRANCA_AMIGAVEL');
    expect(dataFee.chavePixCopiaECola).toContain('br.gov.bcb.pix');
    expect(dataFee.statusCobranca).toBe('FATURA_PROCESSADA_REGUA_ATIVA');
    expect(dataFee.diagnosticoCobranca).toContain('Total Cobrado');
  });

  it('2. Deve autorizar suspensao de servicos apos 60 dias de atraso e notificacao formal conforme Res. CFC 1.590', () => {
    const resSusp = processOfficeContractSuspensionCfcEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Confecções Moderna Eireli',
      totalMesesInadimplente: 3,
      valorTotalDebitoAcumuladoBrl: 9000.00,
      diasAposNotificacaoFormal: 15 // > 10 dias prazo
    });

    const dataSusp = unwrap(resSusp);
    expect(dataSusp.suspensaoServicosAutorizada).toBe(true);
    expect(dataSusp.notificacaoArDigitalEmitida).toBe(true);
    expect(dataSusp.desoneraResponsabilidadeTecnicaContador).toBe(true);
    expect(dataSusp.statusContratual).toBe('SERVICOS_SUSPENSOS_COM_RESPALDO_CFC');
    expect(dataSusp.diagnosticoSuspensao).toContain('AUTORIZADA E REGISTRADA NO CRC');
  });
});
