import { describe, it, expect } from 'vitest';
import {
  processOfficeSpedBatchPrevalidatorEngine,
  processOfficeSpedAutoRectificationEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Auditoria Contínua de SPEDs em Lote & Pré-Validador', () => {
  it('1. Deve pre-validar em lote arquivos SPED (ECD, ECF, EFD), identificando erros estruturais', () => {
    const resBatch = processOfficeSpedBatchPrevalidatorEngine({
      escritorioNome: 'Soberano Auditoria & Contabilidade',
      loteArquivosSped: [
        {
          clienteCnpj: '11.111.111/0001-11',
          razaoSocial: 'Comércio Varejista Alfa Ltda',
          tipoSped: 'EFD_CONTRIBUICOES',
          anoOuMesCompetencia: '2026-07',
          totalLinhasArquivo: 15400,
          possuiDivergenciaPlanoReferencial: false,
          possuiCstIncompativelCfop: false,
          possuiSaldoContabilDesbalanceado: false
        },
        {
          clienteCnpj: '22.222.222/0001-22',
          razaoSocial: 'Indústria Beta S/A',
          tipoSped: 'ECD_CONTABIL',
          anoOuMesCompetencia: '2026',
          totalLinhasArquivo: 48000,
          possuiDivergenciaPlanoReferencial: true, // Advertência
          possuiCstIncompativelCfop: false,
          possuiSaldoContabilDesbalanceado: true // Erro crítico
        }
      ]
    });

    const dataBatch = unwrap(resBatch);
    expect(dataBatch.totalArquivosAuditados).toBe(2);
    expect(dataBatch.totalArquivosAprovados).toBe(1);
    expect(dataBatch.totalArquivosComErros).toBe(1);
    expect(dataBatch.relatorioDetalhado[0].statusValidacao).toBe('SPED_VALIDADO_100_PRONTO_TRANSMISSAO');
    expect(dataBatch.relatorioDetalhado[1].statusValidacao).toBe('SPED_COM_ERROS_REQUER_CORRECAO');
    expect(dataBatch.statusAuditoriaSped).toBe('LOTE_SPED_PRE_VALIDADO_COM_SUCESSO');
    expect(dataBatch.diagnosticoSped).toContain('Pré-Validador SPED em Lote');
  });

  it('2. Deve auto-retificar arquivo SPED gerando novo Hash PVA e relatorio de correcoes', () => {
    const resRect = processOfficeSpedAutoRectificationEngine({
      clienteCnpj: '22.222.222/0001-22',
      razaoSocial: 'Indústria Beta S/A',
      tipoSped: 'ECD_CONTABIL',
      competencia: '2026',
      inconsistenciasDetectadas: [
        'Saldo do Balancete I150 desbalanceado em R$ 0,02',
        'Mapeamento de conta 1.1.01.002 sem de-para no Plano Referencial da RFB'
      ]
    });

    const dataRect = unwrap(resRect);
    expect(dataRect.totalInconsistenciasCorrigidas).toBe(2);
    expect(dataRect.novoHashArquivoSped).toContain('SPED_RETIF_');
    expect(dataRect.statusCorrecao).toBe('ARQUIVO_SPED_AUTO_RETIFICADO_COM_SUCESSO');
    expect(dataRect.diagnosticoCorrecao).toContain('Novo Hash PVA');
  });
});
