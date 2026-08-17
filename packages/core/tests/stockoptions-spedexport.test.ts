import { describe, it, expect } from 'vitest';
import {
  evaluateStockOptionsStjTema1226,
  processSpedBatchExportEngine,
  unwrap
} from '../src/index.js';

describe('TESTES: Stock Options (STJ Tema 1226) & Exportador SPED em Lote', () => {
  it('1. Deve segregar plano de stock options mercantil isento de folha vs plano salarial (STJ 1226)', () => {
    // 1.1 Plano Mercantil com Onerosidade e Risco -> 0 encargos na folha e IRPF Ganho de Capital futuro
    const resMercantil = evaluateStockOptionsStjTema1226({
      planoId: 'SOP-01',
      beneficiarioNome: 'Diretora Executiva de Tecnologia',
      cargo: 'CTO',
      quantidadeOpcoesExercidas: 50000,
      precoExercicioPagoPorAcaoBrl: 10.00, // Strike R$ 10,00
      valorMercadoAcaoNoExercicioBrl: 35.00, // Mercado R$ 35,00
      temOnerosidadeReal: true,
      temRiscoMercado: true,
      precoVendaFuturaAcaoBrl: 50.00 // Vendeu a R$ 50,00 -> Lucro de R$ 40/ação = 2M * 15% = 300k
    });

    const dataMercantil = unwrap(resMercantil);
    expect(dataMercantil.naturezaJuridicaPlano).toBe('MERCANTIL_SEM_ENCARGOS_FOLHA');
    expect(dataMercantil.encargosFolhaInssPatronalBrl).toBe(0);
    expect(dataMercantil.fgtsDevidoBrl).toBe(0);
    expect(dataMercantil.irrfFolhaDevidoBrl).toBe(0);
    expect(dataMercantil.irpfGanhoCapitalAliencaoFuturaBrl).toBe(300000.00); // 15% sobre 2M de ganho de capital
    expect(dataMercantil.diagnosticoStjTema1226).toContain('ISENTO DE INSS, FGTS E IRRF NA FOLHA');

    // 1.2 Plano Salarial (Ações gratuitas / Sem Onerosidade) -> Tributação integral na folha
    const resSalarial = evaluateStockOptionsStjTema1226({
      planoId: 'RSU-02',
      beneficiarioNome: 'Gerente Comercial',
      cargo: 'Gerente',
      quantidadeOpcoesExercidas: 10000,
      precoExercicioPagoPorAcaoBrl: 0, // Ações gratuitas
      valorMercadoAcaoNoExercicioBrl: 20.00, // Ganho 200.000
      temOnerosidadeReal: false,
      temRiscoMercado: false
    });

    const dataSalarial = unwrap(resSalarial);
    expect(dataSalarial.naturezaJuridicaPlano).toBe('REMUNERATORIA_SALARIAL');
    expect(dataSalarial.ganhoEconomicoNoExercicioBrl).toBe(200000.00);
    expect(dataSalarial.encargosFolhaInssPatronalBrl).toBe(56000.00); // 28% de 200k
    expect(dataSalarial.fgtsDevidoBrl).toBe(16000.00); // 8% de 200k
    expect(dataSalarial.irrfFolhaDevidoBrl).toBe(55000.00); // 27,5% de 200k
  });

  it('2. Deve consolidar e exportar em lote arquivos SPED (EFD/ECD/ECF) em pacote ZIP validado', () => {
    const resSped = processSpedBatchExportEngine({
      loteId: 'LOTE-2026-04',
      empresaNome: 'Soberano Indústria e Comércio S.A.',
      cnpj: '12.345.678/0001-90',
      periodoApuracao: '2026-04',
      arquivosParaGeracao: ['EFD_ICMS_IPI', 'EFD_CONTRIBUICOES', 'ECD_CONTABIL', 'ECF_FISCAL'],
      totalRegistrosBlocoC: 10000,
      totalLancamentosContabeis: 25000
    });

    const dataSped = unwrap(resSped);
    expect(dataSped.totalArquivosGerados).toBe(4);
    expect(dataSped.nomePacoteZip).toBe('LOTE_SPED_12345678000190_2026-04.zip');
    expect(dataSped.prontoParaAssinaturaDigital).toBe(true);
    expect(dataSped.arquivosGerados.length).toBe(4);
    expect(dataSped.diagnosticoSped).toContain('4 arquivos SPED gerados com sucesso');
  });
});
