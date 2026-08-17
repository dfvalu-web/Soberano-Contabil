import { describe, it, expect } from 'vitest';
import {
  KmsKeyRotationManager,
  SecurityEngine,
  generateRelatedPartiesDisclosureCpc05,
  calculateGovernmentGrantLaw14789,
  unwrap
} from '../src/index.js';

describe('TESTES: KMS Key Rotation, Partes Relacionadas (CPC 05) & Subvenções (Lei 14.789/2023)', () => {
  it('1. Deve gerenciar ciclo de vida com Envelope Encryption e rotacionar KEK (KMS)', () => {
    const security = new SecurityEngine();
    const kekV1 = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const kms = new KmsKeyRotationManager(security, kekV1);

    const plainDek = 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899';
    const resDek = kms.createEncryptedDek('DEK-TENANT-01', plainDek);
    const dekRecord = unwrap(resDek);

    expect(dekRecord.kekVersion).toBe(1);

    // Decifrar DEK com versão 1
    const decRes1 = kms.decryptDek(dekRecord);
    expect(unwrap(decRes1)).toBe(plainDek);

    // Rotacionar KEK para versão 2
    const kekV2 = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
    const resRotation = kms.rotateKek(kekV2, [dekRecord]);
    const rotatedDeks = unwrap(resRotation);

    expect(kms.getCurrentKekVersion()).toBe(2);
    expect(rotatedDeks[0].kekVersion).toBe(2);

    // Decifrar DEK rotacionado com versão 2
    const decRes2 = kms.decryptDek(rotatedDeks[0]);
    expect(unwrap(decRes2)).toBe(plainDek);
  });

  it('2. Deve mapear transacoes com partes relacionadas e gerar Nota Explicativa (CPC 05 R1)', () => {
    const res = generateRelatedPartiesDisclosureCpc05(2026, [
      {
        transacaoId: 'TR-MUTUO-01',
        nomeParteRelacionada: 'Holding Soberano S.A.',
        naturezaRelacionamento: 'CONTROLADORA',
        tipoTransacao: 'MUTUO_FINANCEIRO',
        valorTransacaoPeriodoBrl: 5000000.00,
        saldoFinalContasReceberPagarBrl: 5200000.00,
        taxaJurosAplicadaPercentAno: 11.5,
        taxaMercadoBenchmarkPercentAno: 11.25 // Diferença de 0.25% < 3% => Comutativa
      },
      {
        transacaoId: 'TR-SERVICOS-02',
        nomeParteRelacionada: 'Beta Tech Coligada Ltda',
        naturezaRelacionamento: 'COLIGADA',
        tipoTransacao: 'PRESTACAO_SERVICOS',
        valorTransacaoPeriodoBrl: 800000.00,
        saldoFinalContasReceberPagarBrl: 150000.00
      }
    ]);

    const data = unwrap(res);
    expect(data.totalTransacoesPartesRelacionadasBrl).toBe(5800000.00);
    expect(data.totalSaldosEmAbertoBrl).toBe(5350000.00);
    expect(data.todasTransacoesEmCondicoesComutativas).toBe(true);
    expect(data.minutaNotaExplicativaCpc05).toContain('NOTA EXPLICATIVA');
    expect(data.diagnosticoCpc05).toContain('Condições estritamente comutativas comprovadas');
  });

  it('3. Deve apurar Credito Fiscal de 25% de IRPJ sobre Subvencao para Investimento (Lei 14.789/2023)', () => {
    const res = calculateGovernmentGrantLaw14789({
      empresaHabilitadaId: 'IND-EXPANSAO-MG-01',
      anoExercicio: 2026,
      enteConcessorNome: 'Governo do Estado de Minas Gerais',
      tipoAtoConcessorio: 'EXPANSAO_EMPREENDIMENTO',
      valorReceitaSubvencaoBrl: 8000000.00, // R$ 8M Subvenção
      custosImplantacaoExpansaoComputaveisBrl: 10000000.00 // R$ 10M CAPEX
    });

    const data = unwrap(res);
    expect(data.receitaSubvencaoTotalBrl).toBe(8000000.00);
    // Crédito Fiscal = 25% de 8M (menor valor) = 2.000.000,00
    expect(data.creditoFiscalIrpjApurado25Percent).toBe(2000000.00);
    expect(data.destinacaoReservaIncentivosFiscaisPlBrl).toBe(8000000.00);
    expect(data.partidasDobradaSubvencao.length).toBe(2);
    expect(data.diagnosticoLei14789).toContain('Novo Marco das Subvenções');
  });
});
